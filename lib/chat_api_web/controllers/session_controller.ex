defmodule ChatApiWeb.SessionController do
  use ChatApiWeb, :controller

  require Logger

  alias ChatApi.{Accounts, Subscriptions}
  alias ChatApiWeb.APIAuthPlug
  alias Plug.Conn

  @spec create(Conn.t(), map()) :: Conn.t()
  def create(conn, %{"user" => user_params}) do
    conn
    |> Pow.Plug.authenticate_user(user_params)
    |> case do
      {:ok, conn} ->
        conn
        |> ChatApiWeb.EnsureUserEnabledPlug.call()
        |> case do
          %{halted: true} = conn ->
            conn

          conn ->
            conn
            |> validate_subscription_and_login()
        end

      {:error, conn} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid email or password"}})
    end
  end

  @spec renew(Conn.t(), map()) :: Conn.t()
  def renew(conn, _params) do
    config = Pow.Plug.fetch_config(conn)

    conn
    |> APIAuthPlug.renew(config)
    |> case do
      {conn, nil} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})

      {conn, user} ->
        conn
        |> ChatApiWeb.EnsureUserEnabledPlug.call(user: user)
        |> case do
          %{halted: true} = conn ->
            conn

          conn ->
            conn
            |> validate_subscription_and_renew(user)
        end
    end
  end

  @spec delete(Conn.t(), map()) :: Conn.t()
  def delete(conn, _params) do
    conn
    |> Pow.Plug.delete()
    |> json(%{data: %{}})
  end

  @spec me(Conn.t(), map()) :: Conn.t()
  def me(conn, _params) do
    case conn.assigns.current_user do
      %{id: id, email: email, account_id: account_id, role: role} ->
        json(conn, %{
          data: %{
            id: id,
            email: email,
            account_id: account_id,
            role: role
          }
        })

      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})
    end
  end

  @spec validate_subscription_and_login(Conn.t()) :: Conn.t()
  defp validate_subscription_and_login(conn) do
    with %{account_id: account_id} <- conn.assigns.current_user,
         account <- Accounts.get_account!(account_id),
         conn <- validate_has_customer_id(account, conn) do
      if conn.halted do
        conn
      else
        check_subscription_status(account, conn, fn subscription ->
          json(conn, %{
            data: %{
              user_id: conn.assigns.current_user.id,
              email: conn.assigns.current_user.email,
              account_id: conn.assigns.current_user.account_id,
              token: conn.private[:api_auth_token],
              renew_token: conn.private[:api_renew_token],
              subscription: format_subscription_response(subscription)
            }
          })
        end)
      end
    else
      _error ->
        conn
        |> put_status(500)
        |> json(%{error: %{status: 500, message: "Internal server error"}})
    end
  end

  @spec validate_subscription_and_renew(Conn.t(), ChatApi.Users.User.t()) :: Conn.t()
  defp validate_subscription_and_renew(conn, user) do
    with account <- Accounts.get_account!(user.account_id),
         conn <- validate_has_customer_id(account, conn) do
      if conn.halted do
        conn
      else
        check_subscription_status(account, conn, fn subscription ->
          json(conn, %{
            data: %{
              user_id: user.id,
              email: user.email,
              account_id: user.account_id,
              token: conn.private[:api_auth_token],
              renew_token: conn.private[:api_renew_token],
              subscription: format_subscription_response(subscription)
            }
          })
        end)
      end
    else
      _error ->
        conn
        |> put_status(500)
        |> json(%{error: %{status: 500, message: "Internal server error"}})
    end
  end

  @spec validate_has_customer_id(ChatApi.Accounts.Account.t(), Conn.t()) :: Conn.t()
  defp validate_has_customer_id(%{subscription_exempt: true}, conn), do: conn

  defp validate_has_customer_id(%{stripe_customer_id: nil}, conn) do
    conn
    |> put_status(403)
    |> json(%{
      error: %{
        status: 403,
        message: "No active subscription. Please complete your account setup.",
        action_required: "setup_account"
      }
    })
    |> halt()
  end

  defp validate_has_customer_id(_account, conn), do: conn

  @spec check_subscription_status(ChatApi.Accounts.Account.t(), Conn.t(), function()) :: Conn.t()
  defp check_subscription_status(account, conn, on_success) do
    case Subscriptions.check_subscription_status(account) do
      {:ok, subscription} ->
        case Subscriptions.subscription_allows_login?(subscription) do
          {true, _status, _reason} ->
            on_success.(subscription)

          {false, status, reason} ->
            conn
            |> put_status(403)
            |> json(%{
              error: %{
                status: 403,
                message: "No active subscription. Please update your payment method.",
                subscription_status: status,
                reason: reason,
                action_required: "update_payment"
              }
            })

          error ->
            Logger.error("Unexpected subscription check result: #{inspect(error)}")
            conn
            |> put_status(403)
            |> json(%{
              error: %{
                status: 403,
                message: "Unable to verify subscription status. Please contact support.",
                action_required: "contact_support"
              }
            })
        end

      {:error, :no_customer_id} ->
        conn
        |> put_status(403)
        |> json(%{
          error: %{
            status: 403,
            message: "No active subscription. Please complete your account setup.",
            action_required: "setup_account"
          }
        })

      {:error, :no_subscription} ->
        conn
        |> put_status(403)
        |> json(%{
          error: %{
            status: 403,
            message: "No active subscription. Please update your payment method.",
            subscription_status: nil,
            action_required: "update_payment"
          }
        })

      {:error, reason} ->
        Logger.error("Stripe API error during login: #{inspect(reason)}")
        conn
        |> put_status(403)
        |> json(%{
          error: %{
            status: 403,
            message: "Unable to verify subscription status. Please contact support.",
            action_required: "contact_support"
          }
        })
    end
  end

  @spec format_subscription_response(Stripe.Subscription.t() | nil) :: map() | nil
  defp format_subscription_response(nil), do: nil

  defp format_subscription_response(%Stripe.Subscription{} = subscription) do
    trial_end =
      if subscription.trial_end do
        subscription.trial_end
        |> DateTime.from_unix!()
        |> DateTime.to_iso8601()
      else
        nil
      end

    current_period_end =
      if subscription.current_period_end do
        subscription.current_period_end
        |> DateTime.from_unix!()
        |> DateTime.to_iso8601()
      else
        nil
      end

    %{
      status: subscription.status,
      trial_end: trial_end,
      current_period_end: current_period_end
    }
  end
end
