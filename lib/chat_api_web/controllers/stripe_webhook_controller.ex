defmodule ChatApiWeb.StripeWebhookController do
  use ChatApiWeb, :controller

  require Logger
  alias ChatApi.{Accounts, Repo}
  alias ChatApi.Accounts.Account

  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, _params) do
    signature = get_req_header(conn, "stripe-signature") |> List.first()
    secret = System.get_env("STRIPE_WEBHOOK_SECRET")

    if is_nil(secret) do
      Logger.error("Missing STRIPE_WEBHOOK_SECRET; rejecting webhook")
      send_resp(conn, 500, "missing configuration")
    else
      raw_body = conn.assigns[:raw_body] || ""

      with {:ok, %Stripe.Event{} = event} <- Stripe.Webhook.construct_event(raw_body, signature, secret),
           :ok <- process_once(event.id, fn -> handle_event(event) end) do
        send_resp(conn, 200, "ok")
      else
        {:error, :already_processed} -> send_resp(conn, 200, "ok")
        {:error, :invalid_signature} -> send_resp(conn, 400, "invalid signature")
        {:error, reason} ->
          Logger.error("Stripe webhook processing error: #{inspect(reason)}")
          send_resp(conn, 400, "bad request")
      end
    end
  end

  defp process_once(event_id, fun) when is_binary(event_id) do
    # Use a simple upsert into the processed events table
    now = DateTime.utc_now() |> DateTime.truncate(:second)

    {count, _} =
      Repo.insert_all(
        "stripe_webhook_events",
        [%{event_id: event_id, inserted_at: now, updated_at: now}],
        on_conflict: :nothing
      )

    if count == 1 do
      try do
        fun.()
        :ok
      rescue
        e ->
          Logger.error("Error during webhook event handling: #{inspect(e)}")
          {:error, :handler_crashed}
      end
    else
      {:error, :already_processed}
    end
  end

  defp handle_event(%Stripe.Event{type: type, data: %{object: object}}) do
    Logger.info("Stripe webhook: #{type}")

    case type do
      "customer.subscription.created" -> upsert_subscription(object)
      "customer.subscription.updated" -> upsert_subscription(object)
      "customer.subscription.deleted" -> cancel_subscription(object)
      "checkout.session.completed" -> apply_checkout_session(object)
      # Optional: invoice webhooks can adjust state
      "invoice.payment_succeeded" -> :ok
      "invoice.payment_failed" -> :ok
      _ -> :ok
    end
  end

  defp upsert_subscription(%Stripe.Subscription{} = subscription) do
    account_id = get_in(subscription, [Access.key(:metadata, %{}), "netia_account_id"])
    with {:ok, %Account{} = account} <- fetch_account(account_id) do
      params = subscription_to_account_params(subscription)
      Accounts.update_billing_info(account, params)
      :ok
    else
      {:error, reason} -> Logger.warn("Skipping subscription upsert: #{inspect(reason)}")
      _ -> :ok
    end
  end

  defp cancel_subscription(%Stripe.Subscription{} = subscription) do
    account_id = get_in(subscription, [Access.key(:metadata, %{}), "netia_account_id"])
    with {:ok, %Account{} = account} <- fetch_account(account_id) do
      params = %{
        stripe_subscription_id: subscription.id,
        stripe_subscription_status: "canceled"
      }
      Accounts.update_billing_info(account, params)
      :ok
    else
      {:error, reason} -> Logger.warn("Skipping subscription cancel: #{inspect(reason)}")
      _ -> :ok
    end
  end

  defp apply_checkout_session(%Stripe.Checkout.Session{} = session) do
    account_id = get_in(session, [Access.key(:metadata, %{}), "netia_account_id"])

    with {:ok, %Account{} = account} <- fetch_account(account_id) do
      # session.customer and session.subscription may be strings (IDs)
      subscription =
        case session.subscription do
          %Stripe.Subscription{} = sub -> sub
          sub_id when is_binary(sub_id) -> Stripe.Subscription.retrieve(sub_id)
          _ -> nil
        end

      sub = case subscription do
        {:ok, %Stripe.Subscription{} = s} -> s
        %Stripe.Subscription{} = s -> s
        _ -> nil
      end

      params =
        %{stripe_customer_id: as_id(session.customer)}
        |> Map.merge(if sub, do: subscription_to_account_params(sub), else: %{})

      Accounts.update_billing_info(account, params)
      :ok
    else
      {:error, reason} -> Logger.warn("Skipping checkout.session.completed: #{inspect(reason)}")
      _ -> :ok
    end
  end

  defp subscription_to_account_params(%Stripe.Subscription{} = s) do
    item = List.first(s.items.data) || %{}
    price = Map.get(item, :price)
    product = if is_map(price), do: Map.get(price, :product), else: nil

    plan_product_id =
      as_id(product) ||
        (case Map.get(item, :plan) do
           %Stripe.Plan{id: id} -> id
           id when is_binary(id) -> id
           _ -> nil
         end)

    price_id = if is_map(price), do: price.id, else: nil

    %{
      stripe_subscription_id: s.id,
      stripe_subscription_status: s.status,
      stripe_current_period_end: unix_to_datetime(s.current_period_end),
      stripe_product_id: plan_product_id,
      stripe_price_id: price_id
    }
  end

  defp unix_to_datetime(nil), do: nil
  defp unix_to_datetime(ts) when is_integer(ts), do: DateTime.from_unix!(ts)

  defp as_id(%{id: id}) when is_binary(id), do: id
  defp as_id(id) when is_binary(id), do: id
  defp as_id(_), do: nil

  defp fetch_account(nil), do: {:error, :no_account_in_metadata}
  defp fetch_account(account_id) do
    try do
      {:ok, Accounts.get_account!(account_id)}
    rescue
      _ -> {:error, :account_not_found}
    end
  end
end


