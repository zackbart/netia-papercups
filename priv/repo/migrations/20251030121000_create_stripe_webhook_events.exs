defmodule ChatApi.Repo.Migrations.CreateStripeWebhookEvents do
  use Ecto.Migration

  def change do
    create table(:stripe_webhook_events) do
      add :event_id, :string, null: false

      timestamps()
    end

    create unique_index(:stripe_webhook_events, [:event_id])
  end
end


