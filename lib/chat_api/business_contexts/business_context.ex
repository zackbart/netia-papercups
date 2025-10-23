defmodule ChatApi.BusinessContexts.BusinessContext do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "business_contexts" do
    field(:business_name, :string)
    field(:business_description, :string)
    field(:services, :map, default: %{})
    field(:scheduling_link, :string)
    field(:faqs, :map, default: %{})
    field(:additional_context, :string)

    belongs_to(:account, ChatApi.Accounts.Account)

    timestamps()
  end

  @doc false
  def changeset(business_context, attrs) do
    business_context
    |> cast(attrs, [
      :business_name,
      :business_description,
      :services,
      :scheduling_link,
      :faqs,
      :additional_context,
      :account_id
    ])
    |> validate_required([:business_name, :account_id])
    |> validate_length(:business_name, min: 1, max: 255)
    |> validate_length(:business_description, max: 2000)
    |> validate_length(:additional_context, max: 5000)
    |> validate_format(:scheduling_link, ~r/^https?:\/\/.+/,
      message: "must be a valid URL"
    )
    |> unique_constraint(:account_id)
  end
end
