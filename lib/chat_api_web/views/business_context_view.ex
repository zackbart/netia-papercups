defmodule ChatApiWeb.BusinessContextView do
  use ChatApiWeb, :view

  def render("show.json", %{business_context: business_context}) do
    %{
      id: business_context.id,
      business_name: business_context.business_name,
      business_description: business_context.business_description,
      services: business_context.services || [],
      scheduling_link: business_context.scheduling_link,
      faqs: business_context.faqs || [],
      additional_context: business_context.additional_context,
      inserted_at: business_context.inserted_at,
      updated_at: business_context.updated_at
    }
  end

  def render("error.json", %{message: message}) do
    %{
      error: message
    }
  end

  def render("error.json", %{errors: errors}) do
    %{
      errors: errors
    }
  end
end
