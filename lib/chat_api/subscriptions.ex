defmodule ChatApi.Subscriptions do
  @moduledoc """
  Subscription validation and status checking.
  """

  require Logger
  alias ChatApi.Accounts.Account

  @doc """
  Checks the subscription status for an account by querying Stripe.
  Returns {:ok, subscription} or {:error, reason}.
  """
  @spec check_subscription_status(Account.t()) :: {:ok, Stripe.Subscription.t()} | {:error, atom()}
  def check_subscription_status(%Account{stripe_customer_id: nil}) do
    {:error, :no_customer_id}
  end

  def check_subscription_status(%Account{stripe_customer_id: customer_id}) do
    case Stripe.Subscription.list(%{customer: customer_id, status: "all", limit: 1}) do
      {:ok, %{data: [subscription | _]}} ->
        {:ok, subscription}

      {:ok, %{data: []}} ->
        {:error, :no_subscription}

      {:error, %Stripe.Error{} = error} ->
        Logger.error("Stripe API error when checking subscription: #{inspect(error)}")
        {:error, :stripe_error}

      error ->
        Logger.error("Unexpected error when checking subscription: #{inspect(error)}")
        {:error, :unexpected_error}
    end
  end

  @doc """
  Determines if a subscription allows login.
  Returns {allowed: boolean, status: string | nil, reason: string | nil}.
  """
  @spec subscription_allows_login?(Stripe.Subscription.t() | nil) ::
          {boolean(), String.t() | nil, String.t() | nil}
  def subscription_allows_login?(nil) do
    {false, nil, "No subscription found"}
  end

  def subscription_allows_login?(%Stripe.Subscription{status: status} = subscription) do
    case status do
      "active" ->
        {true, "active", nil}

      "trialing" ->
        # Check if trial has expired
        if trial_expired?(subscription) do
          {false, "trialing", "Trial period has expired"}
        else
          {true, "trialing", nil}
        end

      "canceled" ->
        {false, "canceled", "Subscription has been canceled"}

      "unpaid" ->
        {false, "unpaid", "Subscription payment failed"}

      "past_due" ->
        {false, "past_due", "Subscription payment is past due"}

      other_status ->
        Logger.warning("Unknown subscription status: #{other_status}")
        {false, other_status, "Subscription status: #{other_status}"}
    end
  end

  @spec trial_expired?(Stripe.Subscription.t()) :: boolean()
  defp trial_expired?(%Stripe.Subscription{trial_end: nil}), do: false

  defp trial_expired?(%Stripe.Subscription{trial_end: trial_end}) do
    trial_end_unix = DateTime.from_unix!(trial_end)
    DateTime.compare(trial_end_unix, DateTime.utc_now()) == :lt
  end
end

