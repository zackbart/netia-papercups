defmodule ChatApiWeb.StripeController do
  use ChatApiWeb, :controller

  alias ChatApi.Accounts

  action_fallback ChatApiWeb.FallbackController

  @spec link(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def link(conn, params) do
    with %{account_id: user_account_id} <- conn.assigns.current_user,
         %{"account_id" => account_id} <- params,
         true <- user_account_id == account_id do
      account = Accounts.get_account!(account_id)

      billing_params =
        params
        |> Map.take(["stripe_customer_id", "stripe_subscription_id", "stripe_product_id"])
        |> Enum.reject(fn {_k, v} -> is_nil(v) end)
        |> Map.new()

      case Accounts.update_billing_info(account, billing_params) do
        {:ok, updated_account} ->
          json(conn, %{
            data: %{
              account_id: updated_account.id,
              stripe_customer_id: updated_account.stripe_customer_id,
              stripe_subscription_id: updated_account.stripe_subscription_id,
              stripe_product_id: updated_account.stripe_product_id
            }
          })

        {:error, changeset} ->
          conn
          |> put_status(422)
          |> json(%{
            error: %{
              status: 422,
              message: "Failed to update billing information",
              errors: changeset.errors
            }
          })
      end
    else
      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})

      %{"account_id" => _} ->
        conn
        |> put_status(403)
        |> json(%{
          error: %{
            status: 403,
            message: "Account ID does not match authenticated user's account"
          }
        })

      _ ->
        conn
        |> put_status(400)
        |> json(%{
          error: %{
            status: 400,
            message: "account_id is required"
          }
        })
    end
  end
end

