defmodule ChatApiWeb.OnboardingController do
  use ChatApiWeb, :controller

  alias ChatApi.{Accounts, Users, Inboxes, BusinessContexts}
  alias ChatApi.Accounts.Account
  alias ChatApi.Users.User
  alias ChatApi.Inboxes.Inbox
  alias ChatApi.BusinessContexts.BusinessContext

  action_fallback ChatApiWeb.FallbackController

  @doc """
  Creates a new account, user, primary inbox, and business context via API.

  This endpoint is designed for external systems (like the main Netia system)
  to create new tenants with their business context.

  ## Request Body

      {
        "email": "user@example.com",
        "password": "secure_password",
        "company_name": "Example Company",
        "business_context": {
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
      }

  ## Response

      {
        "account_id": "uuid",
        "inbox_id": "uuid",
        "user_id": "uuid",
        "message": "Account created successfully"
      }
  """
  def create(conn, params) do
    with {:ok, account_params} <- validate_account_params(params),
         {:ok, user_params} <- validate_user_params(params),
         {:ok, business_context_params} <- validate_business_context_params(params),
         {:ok, %{account: account, user: user, inbox: inbox, business_context: business_context}} <-
           create_account_with_user_and_context(account_params, user_params, business_context_params) do
      # Send user invitation email
      send_user_invitation_email(user, account)

      conn
      |> put_status(:created)
      |> render("create.json", %{
        account_id: account.id,
        inbox_id: inbox.id,
        user_id: user.id,
        message: "Account created successfully"
      })
    else
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", %{errors: changeset.errors})
    end
  end

  defp validate_account_params(params) do
    case Map.get(params, "company_name") do
      nil -> {:error, %{company_name: {"can't be blank", []}}}
      company_name when is_binary(company_name) and byte_size(company_name) > 0 ->
        {:ok, %{company_name: company_name}}
      _ -> {:error, %{company_name: {"must be a valid string", []}}}
    end
  end

  defp validate_user_params(params) do
    with {:ok, email} <- validate_email(params),
         {:ok, password} <- validate_password(params) do
      {:ok, %{email: email, password: password, password_confirmation: password}}
    end
  end

  defp validate_email(params) do
    case Map.get(params, "email") do
      nil -> {:error, %{email: {"can't be blank", []}}}
      email when is_binary(email) ->
        case Regex.match?(~r/^[^\s]+@[^\s]+\.[^\s]+$/, email) do
          true -> {:ok, email}
          false -> {:error, %{email: {"must be a valid email address", []}}}
        end
      _ -> {:error, %{email: {"must be a string", []}}}
    end
  end

  defp validate_password(params) do
    case Map.get(params, "password") do
      nil -> {:error, %{password: {"can't be blank", []}}}
      password when is_binary(password) and byte_size(password) >= 8 ->
        {:ok, password}
      _ -> {:error, %{password: {"must be at least 8 characters", []}}}
    end
  end

  defp validate_business_context_params(params) do
    case Map.get(params, "business_context") do
      nil -> {:ok, %{}}
      business_context when is_map(business_context) ->
        {:ok, business_context}
      _ -> {:error, %{business_context: {"must be a valid object", []}}}
    end
  end

  defp create_account_with_user_and_context(account_params, user_params, business_context_params) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:account, fn _repo, %{} ->
      Accounts.create_account(account_params)
    end)
    |> Ecto.Multi.run(:user, fn _repo, %{account: account} ->
      user_params_with_account = Map.put(user_params, :account_id, account.id)
      Users.create_user(user_params_with_account)
    end)
    |> Ecto.Multi.run(:inbox, fn _repo, %{account: account} ->
      Inboxes.create_inbox(%{
        account_id: account.id,
        name: "Primary Inbox",
        description: "This is the primary Papercups inbox for #{account.company_name}. All messages will flow into here by default.",
        is_primary: true,
        is_private: false
      })
    end)
    |> Ecto.Multi.run(:business_context, fn _repo, %{account: account} ->
      business_context_with_account = Map.put(business_context_params, :account_id, account.id)
      BusinessContexts.create_business_context(business_context_with_account)
    end)
    |> ChatApi.Repo.transaction()
  end

  defp send_user_invitation_email(user, account) do
    # This would typically send an email invitation to the user
    # For now, we'll just log it
    require Logger
    Logger.info("User invitation email would be sent to #{user.email} for account #{account.company_name}")
    
    # TODO: Implement actual email sending using the existing mailer system
    # ChatApi.Mailers.UserMailer.send_invitation_email(user, account)
  end
end
