#!/usr/bin/env elixir

# Email Test Script
# Run this in your production environment to test email sending

# Add this to your production console or run as a script
# This will test the email delivery system

IO.puts("=== EMAIL DELIVERY TEST ===")

# Test email configuration
try do
  # Test basic email delivery
  test_email = %Swoosh.Email{
    to: [{"Test User", "test@example.com"}],
    from: {"Netia", "noreply@netia.ai"},
    subject: "Test Email",
    text_body: "This is a test email from Netia.",
    html_body: "<p>This is a test email from Netia.</p>"
  }
  
  IO.puts("Attempting to send test email...")
  
  case ChatApi.Mailers.deliver(test_email) do
    {:ok, result} ->
      IO.puts("✓ Email sent successfully!")
      IO.puts("Result: #{inspect(result)}")
      
    {:error, reason} ->
      IO.puts("❌ Email failed to send!")
      IO.puts("Error: #{inspect(reason)}")
      
    other ->
      IO.puts("⚠️  Unexpected result: #{inspect(other)}")
  end
  
rescue
  e ->
    IO.puts("❌ Exception occurred: #{inspect(e)}")
    IO.puts("This usually means email configuration is missing or incorrect.")
end

IO.puts("")
IO.puts("=== PASSWORD RESET EMAIL TEST ===")

# Test password reset email specifically
try do
  # Create a test user (you'll need to replace with actual user data)
  test_user = %ChatApi.Users.User{
    id: 1,
    email: "test@example.com",
    password_reset_token: "test_token_123"
  }
  
  IO.puts("Testing password reset email...")
  
  case ChatApi.Emails.send_password_reset_email(test_user) do
    {:ok, result} ->
      IO.puts("✓ Password reset email sent successfully!")
      IO.puts("Result: #{inspect(result)}")
      
    {:error, reason} ->
      IO.puts("❌ Password reset email failed!")
      IO.puts("Error: #{inspect(reason)}")
      
    {:warning, reason} ->
      IO.puts("⚠️  Password reset email warning: #{inspect(reason)}")
      
    other ->
      IO.puts("⚠️  Unexpected result: #{inspect(other)}")
  end
  
rescue
  e ->
    IO.puts("❌ Exception occurred: #{inspect(e)}")
    IO.puts("This usually means email configuration is missing or incorrect.")
end

IO.puts("")
IO.puts("=== CHECK LOGS ===")
IO.puts("If emails are still not working, check your application logs for:")
IO.puts("- 'Email config environment variable may not have been setup properly'")
IO.puts("- 'Successfully sent password reset email'")
IO.puts("- 'Error sending password reset email'")
IO.puts("- 'Warning when sending password reset email'")
