#!/usr/bin/env elixir

# Mailgun Test Script
# Run this to test your Mailgun configuration

IO.puts("=== MAILGUN CONFIGURATION TEST ===")
IO.puts("")

# Check environment variables
mailer_adapter = System.get_env("MAILER_ADAPTER")
mailgun_api_key = System.get_env("MAILGUN_API_KEY")
domain = System.get_env("DOMAIN")
from_address = System.get_env("FROM_ADDRESS")

IO.puts("MAILER_ADAPTER: #{mailer_adapter || "NOT SET"}")
IO.puts("MAILGUN_API_KEY: #{if mailgun_api_key, do: "SET (#{String.length(mailgun_api_key)} chars)", else: "NOT SET"}")
IO.puts("DOMAIN: #{domain || "NOT SET"}")
IO.puts("FROM_ADDRESS: #{from_address || "NOT SET"}")
IO.puts("")

# Validate configuration
if mailer_adapter != "Swoosh.Adapters.Mailgun" do
  IO.puts("❌ MAILER_ADAPTER must be set to 'Swoosh.Adapters.Mailgun'")
  System.halt(1)
end

if !mailgun_api_key do
  IO.puts("❌ MAILGUN_API_KEY is required")
  System.halt(1)
end

if !domain do
  IO.puts("❌ DOMAIN is required")
  System.halt(1)
end

IO.puts("✓ Configuration looks good!")
IO.puts("")

# Test email sending
IO.puts("=== TESTING EMAIL DELIVERY ===")

try do
  # Create a test email
  test_email = %Swoosh.Email{
    to: [{"Test User", "test@example.com"}],
    from: {"Netia", from_address || "noreply@#{domain}"},
    subject: "Netia Mailgun Test",
    text_body: "This is a test email from Netia to verify Mailgun is working correctly.",
    html_body: "<p>This is a test email from <strong>Netia</strong> to verify Mailgun is working correctly.</p>"
  }
  
  IO.puts("Sending test email...")
  
  case ChatApi.Mailers.deliver(test_email) do
    {:ok, result} ->
      IO.puts("✅ SUCCESS! Email sent successfully!")
      IO.puts("Result: #{inspect(result)}")
      IO.puts("")
      IO.puts("Check your Mailgun dashboard for delivery status.")
      
    {:error, reason} ->
      IO.puts("❌ FAILED! Email could not be sent.")
      IO.puts("Error: #{inspect(reason)}")
      IO.puts("")
      IO.puts("Common issues:")
      IO.puts("- Domain not verified in Mailgun")
      IO.puts("- Invalid API key")
      IO.puts("- DNS records not properly configured")
      
    other ->
      IO.puts("⚠️  Unexpected result: #{inspect(other)}")
  end
  
rescue
  e ->
    IO.puts("❌ Exception occurred: #{inspect(e)}")
    IO.puts("")
    IO.puts("This usually means:")
    IO.puts("- Email configuration is missing")
    IO.puts("- Mailgun credentials are invalid")
    IO.puts("- Domain is not verified")
end

IO.puts("")
IO.puts("=== NEXT STEPS ===")
IO.puts("1. If test failed, verify your domain in Mailgun dashboard")
IO.puts("2. Check DNS records are properly configured")
IO.puts("3. Ensure API key is correct")
IO.puts("4. Test password reset functionality")
IO.puts("5. Check Mailgun logs for delivery issues")
