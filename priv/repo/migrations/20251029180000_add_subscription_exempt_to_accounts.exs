defmodule ChatApi.Repo.Migrations.AddSubscriptionExemptToAccounts do
  use Ecto.Migration

  def change do
    alter table(:accounts) do
      add :subscription_exempt, :boolean, default: false, null: false
    end

    create index(:accounts, [:subscription_exempt])
  end
end


