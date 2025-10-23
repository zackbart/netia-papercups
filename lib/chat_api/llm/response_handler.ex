defmodule ChatApi.LLM.ResponseHandler do
  @moduledoc """
  Handles LLM responses for customer messages.
  """

  require Logger
  alias ChatApi.{Messages, BusinessContexts, LLM.OpenAIClient, Conversations}

  @doc """
  Processes a customer message and generates an LLM response.

  ## Examples

      iex> handle_customer_message(conversation_id, account_id)
      {:ok, %Message{}}

      iex> handle_customer_message(conversation_id, account_id)
      {:error, "Failed to generate response"}

  """
  def handle_customer_message(conversation_id, account_id) do
    with {:ok, conversation_history} <- get_conversation_history(conversation_id),
         {:ok, business_context} <- get_business_context(account_id),
         {:ok, llm_response} <- generate_llm_response(conversation_history, business_context),
         {:ok, message} <- create_llm_message(conversation_id, llm_response) do
      {:ok, message}
    else
      {:error, reason} ->
        Logger.error("LLM response failed: #{inspect(reason)}")
        create_fallback_message(conversation_id)
    end
  end

  defp get_conversation_history(conversation_id) do
    try do
      # Order messages chronologically (oldest first) for proper AI context
      messages = Messages.list_by_conversation(conversation_id, %{}, order_by: [asc: :inserted_at])
      Logger.info("Conversation history for #{conversation_id}: #{length(messages)} messages")
      Enum.each(messages, fn msg ->
        Logger.info("  - #{msg.source}: #{String.slice(msg.body, 0..50)}")
      end)
      {:ok, messages}
    rescue
      error -> {:error, "Failed to fetch conversation history: #{inspect(error)}"}
    end
  end

  defp get_business_context(account_id) do
    case BusinessContexts.get_business_context_by_account(account_id) do
      nil -> 
        Logger.warn("No business context found for account #{account_id}")
        {:ok, %{}}
      business_context -> 
        context_map = Map.from_struct(business_context)
        Logger.info("Business context loaded for account #{account_id}: #{business_context.business_name || "unnamed"}")
        Logger.debug("Business context details: #{inspect(Map.take(context_map, [:business_name, :business_description, :scheduling_link]))}")
        {:ok, context_map}
    end
  end

  defp generate_llm_response(conversation_history, business_context) do
    # Convert messages to the format expected by OpenAI client
    formatted_history = Enum.map(conversation_history, fn message ->
      %{
        source: message.source,
        body: message.body
      }
    end)

    OpenAIClient.generate_response(formatted_history, business_context)
  end

  defp create_llm_message(conversation_id, response_text) do
    # Get the conversation to extract account_id
    conversation = Conversations.get_conversation!(conversation_id)
    
    message_params = %{
      body: response_text,
      conversation_id: conversation_id,
      account_id: conversation.account_id,
      source: "chat",
      type: "bot",
      content_type: "text",
      metadata: %{llm_generated: true}
    }

    case Messages.create_message(message_params) do
      {:ok, message} -> {:ok, message}
      {:error, changeset} -> {:error, "Failed to create LLM message: #{inspect(changeset.errors)}"}
    end
  end

  defp create_fallback_message(conversation_id) do
    fallback_text = "I'm having trouble responding right now. Please try again or contact our support team directly."
    
    # Get the conversation to extract account_id
    conversation = Conversations.get_conversation!(conversation_id)

    message_params = %{
      body: fallback_text,
      conversation_id: conversation_id,
      account_id: conversation.account_id,
      source: "chat",
      type: "bot",
      content_type: "text",
      metadata: %{llm_generated: true, fallback: true}
    }

    case Messages.create_message(message_params) do
      {:ok, message} -> {:ok, message}
      {:error, _} -> {:error, "Failed to create fallback message"}
    end
  end
end
