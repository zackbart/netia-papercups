defmodule ChatApi.Repo.Migrations.CreateBusinessContexts do
  use Ecto.Migration

  def change do
    create table(:business_contexts, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:business_name, :string, null: false)
      add(:business_description, :text)
      add(:services, :map, default: %{})
      add(:scheduling_link, :string)
      add(:faqs, :map, default: %{})
      add(:additional_context, :text)

      add(:account_id, references(:accounts, on_delete: :delete_all, type: :binary_id),
        null: false
      )

      timestamps()
    end

    create(unique_index(:business_contexts, [:account_id]))
  end
end
