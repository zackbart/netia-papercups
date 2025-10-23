defmodule ChatApiWeb.OnboardingView do
  use ChatApiWeb, :view

  def render("create.json", %{account_id: account_id, inbox_id: inbox_id, user_id: user_id, message: message}) do
    %{
      account_id: account_id,
      inbox_id: inbox_id,
      user_id: user_id,
      message: message
    }
  end

  def render("error.json", %{errors: errors}) do
    %{
      errors: errors
    }
  end
end
