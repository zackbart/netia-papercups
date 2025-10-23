defmodule ChatApi.LLM.OpenAIClient do
  @moduledoc """
  OpenAI API client for generating LLM responses.
  """

  require Logger

  @api_base_url "https://api.openai.com/v1"
  @default_model "gpt-3.5-turbo"
  @default_max_tokens 500
  @default_temperature 0.7

  @doc """
  Generates a response from OpenAI based on conversation history and business context.

  ## Examples

      iex> generate_response([%{role: "user", content: "Hello"}], %{business_name: "My Company"})
      {:ok, "Hello! How can I help you today?"}

      iex> generate_response([], %{})
      {:error, "No conversation history provided"}

  """
  def generate_response(conversation_history, business_context) when is_list(conversation_history) do
    with {:ok, api_key} <- get_api_key(),
         {:ok, system_prompt} <- build_system_prompt(business_context),
         {:ok, messages} <- format_conversation_history(conversation_history, system_prompt),
         {:ok, response} <- call_openai_api(messages, api_key) do
      {:ok, response}
    else
      {:error, reason} -> {:error, reason}
    end
  end

  def generate_response(_, _) do
    {:error, "Invalid conversation history format"}
  end

  defp get_api_key do
    case System.get_env("OPENAI_API_KEY") do
      nil -> {:error, "OPENAI_API_KEY not configured"}
      key when is_binary(key) and byte_size(key) > 0 -> {:ok, key}
      _ -> {:error, "Invalid OPENAI_API_KEY"}
    end
  end

  defp build_system_prompt(business_context) do
    system_prompt = """
    You are a helpful customer service assistant for #{business_context[:business_name] || "this business"}.
    
    #{if business_context[:business_description], do: "Business Description: #{business_context[:business_description]}"}
    
    #{if business_context[:services] && map_size(business_context[:services]) > 0 do
      "Services offered:\n" <> Enum.map_join(business_context[:services], "\n", fn {_key, service} ->
        "- #{service["name"]}: #{service["description"]}#{if service["price"], do: " (#{service["price"]})"}"
      end)
    end}
    
    #{if business_context[:faqs] && map_size(business_context[:faqs]) > 0 do
      "Frequently Asked Questions:\n" <> Enum.map_join(business_context[:faqs], "\n", fn {_key, faq} ->
        "Q: #{faq["question"]}\nA: #{faq["answer"]}"
      end)
    end}
    
    #{if business_context[:scheduling_link] do
      "To schedule an appointment or consultation, please visit: #{business_context[:scheduling_link]}"
    end}
    
    #{if business_context[:additional_context] do
      "Additional context: #{business_context[:additional_context]}"
    end}
    
    Be helpful, professional, and concise. If you don't know something specific about their business, 
    offer to connect them with a team member or direct them to the scheduling link if available.
    """

    {:ok, system_prompt}
  end

  defp format_conversation_history(history, system_prompt) do
    # Limit to last 10 messages to stay within token limits
    recent_history = Enum.take(history, -10)
    
    messages = [
      %{role: "system", content: system_prompt}
    ] ++ Enum.map(recent_history, fn message ->
      role = case message[:source] do
        "chat" -> "user"
        _ -> "assistant"
      end
      
      %{role: role, content: message[:body] || ""}
    end)

    {:ok, messages}
  end

  defp call_openai_api(messages, api_key) do
    model = System.get_env("LLM_MODEL", @default_model)
    max_tokens = System.get_env("LLM_MAX_TOKENS", @default_max_tokens) |> String.to_integer()
    temperature = System.get_env("LLM_TEMPERATURE", @default_temperature) |> String.to_float()

    request_body = %{
      model: model,
      messages: messages,
      max_tokens: max_tokens,
      temperature: temperature
    }

    headers = [
      {"Authorization", "Bearer #{api_key}"},
      {"Content-Type", "application/json"}
    ]

    case HTTPoison.post("#{@api_base_url}/chat/completions", Jason.encode!(request_body), headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        case Jason.decode(body) do
          {:ok, %{"choices" => [%{"message" => %{"content" => content}} | _]}} ->
            {:ok, String.trim(content)}
          {:ok, _} ->
            {:error, "Unexpected response format from OpenAI"}
          {:error, _} ->
            {:error, "Failed to parse OpenAI response"}
        end

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        Logger.error("OpenAI API error: #{status_code} - #{body}")
        {:error, "OpenAI API error: #{status_code}"}

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error("HTTP request failed: #{inspect(reason)}")
        {:error, "Failed to connect to OpenAI API"}
    end
  end
end
