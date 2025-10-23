defmodule ChatApiWeb.BusinessContextController do
  use ChatApiWeb, :controller

  alias ChatApi.BusinessContexts

  action_fallback ChatApiWeb.FallbackController

  @doc """
  Gets the business context for the current account.

  ## Response

      {
        "id": "uuid",
        "business_name": "Example Company",
        "business_description": "We provide excellent services",
        "services": [
          {
            "name": "Consultation",
            "description": "One-on-one consultation",
            "price": "$100/hour"
          }
        ],
        "scheduling_link": "https://calendly.com/example",
        "faqs": [
          {
            "question": "What are your hours?",
            "answer": "We're open 9-5 Monday through Friday"
          }
        ],
        "additional_context": "We pride ourselves on customer service"
      }
  """
  def show(conn, _params) do
    with %{account_id: account_id} <- conn.assigns.current_user do
      case BusinessContexts.get_business_context_by_account(account_id) do
        nil ->
          conn
          |> put_status(:not_found)
          |> render("error.json", %{message: "Business context not found"})

        business_context ->
          render(conn, "show.json", business_context: business_context)
      end
    end
  end

  def create(conn, %{"business_context" => business_context_params}) do
    with %{account_id: account_id} <- conn.assigns.current_user do
      case BusinessContexts.create_business_context(
             Map.put(business_context_params, "account_id", account_id)
           ) do
        {:ok, business_context} ->
          render(conn, "show.json", business_context: business_context)

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render("error.json", changeset: changeset)
      end
    end
  end

  @doc """
  Updates the business context for the current account.

  ## Request Body

      {
        "business_name": "Example Company",
        "business_description": "We provide excellent services",
        "services": [
          {
            "name": "Consultation",
            "description": "One-on-one consultation",
            "price": "$100/hour"
          }
        ],
        "scheduling_link": "https://calendly.com/example",
        "faqs": [
          {
            "question": "What are your hours?",
            "answer": "We're open 9-5 Monday through Friday"
          }
        ],
        "additional_context": "We pride ourselves on customer service"
      }

  ## Response

      {
        "id": "uuid",
        "business_name": "Example Company",
        ...
      }
  """
  def update(conn, %{"business_context" => business_context_params}) do
    with %{account_id: account_id} <- conn.assigns.current_user do
      case BusinessContexts.get_business_context_by_account(account_id) do
        nil ->
          # Create new business context
          case BusinessContexts.create_business_context(
                 Map.put(business_context_params, :account_id, account_id)
               ) do
            {:ok, business_context} ->
              render(conn, "show.json", business_context: business_context)

            {:error, changeset} ->
              conn
              |> put_status(:unprocessable_entity)
              |> render("error.json", %{errors: changeset.errors})
          end

        business_context ->
          # Update existing business context
          case BusinessContexts.update_business_context(business_context, business_context_params) do
            {:ok, business_context} ->
              render(conn, "show.json", business_context: business_context)

            {:error, changeset} ->
              conn
              |> put_status(:unprocessable_entity)
              |> render("error.json", %{errors: changeset.errors})
          end
      end
    end
  end

  def update(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> render("error.json", %{message: "business_context parameter is required"})
  end
end
