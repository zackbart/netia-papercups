defmodule ChatApi.BusinessContexts do
  @moduledoc """
  The BusinessContexts context.
  """

  import Ecto.Query, warn: false
  alias ChatApi.Repo

  alias ChatApi.BusinessContexts.BusinessContext

  @doc """
  Returns the list of business_contexts.

  ## Examples

      iex> list_business_contexts()
      [%BusinessContext{}, ...]

  """
  def list_business_contexts do
    Repo.all(BusinessContext)
  end

  @doc """
  Gets a single business_context.

  Raises `Ecto.NoResultsError` if the Business context does not exist.

  ## Examples

      iex> get_business_context!(123)
      %BusinessContext{}

      iex> get_business_context!(456)
      ** (Ecto.NoResultsError)

  """
  def get_business_context!(id), do: Repo.get!(BusinessContext, id)

  @doc """
  Gets a business context by account ID.

  Returns `nil` if no business context exists for the account.

  ## Examples

      iex> get_business_context_by_account("account-id")
      %BusinessContext{}

      iex> get_business_context_by_account("non-existent")
      nil

  """
  def get_business_context_by_account(account_id) do
    Repo.get_by(BusinessContext, account_id: account_id)
  end

  @doc """
  Creates a business_context.

  ## Examples

      iex> create_business_context(%{field: value})
      {:ok, %BusinessContext{}}

      iex> create_business_context(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_business_context(attrs \\ %{}) do
    %BusinessContext{}
    |> BusinessContext.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a business_context.

  ## Examples

      iex> update_business_context(business_context, %{field: new_value})
      {:ok, %BusinessContext{}}

      iex> update_business_context(business_context, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_business_context(%BusinessContext{} = business_context, attrs) do
    business_context
    |> BusinessContext.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Creates or updates a business context for an account.

  ## Examples

      iex> upsert_business_context("account-id", %{business_name: "My Company"})
      {:ok, %BusinessContext{}}

  """
  def upsert_business_context(account_id, attrs) do
    case get_business_context_by_account(account_id) do
      nil -> create_business_context(Map.put(attrs, :account_id, account_id))
      business_context -> update_business_context(business_context, attrs)
    end
  end

  @doc """
  Deletes a business_context.

  ## Examples

      iex> delete_business_context(business_context)
      {:ok, %BusinessContext{}}

      iex> delete_business_context(business_context)
      {:error, %Ecto.Changeset{}}

  """
  def delete_business_context(%BusinessContext{} = business_context) do
    Repo.delete(business_context)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking business_context changes.

  ## Examples

      iex> change_business_context(business_context)
      %Ecto.Changeset{data: %BusinessContext{}}

  """
  def change_business_context(%BusinessContext{} = business_context, attrs \\ %{}) do
    BusinessContext.changeset(business_context, attrs)
  end
end
