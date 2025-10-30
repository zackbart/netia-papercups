defmodule ChatApi.Repo.Migrations.AddStripeSubscriptionFieldsToAccounts do
  use Ecto.Migration

  def change do
    alter table(:accounts) do
      add :stripe_subscription_status, :string
      add :stripe_current_period_end, :utc_datetime
      add :stripe_price_id, :string
    end

    create index(:accounts, [:stripe_subscription_status])
  end
end


