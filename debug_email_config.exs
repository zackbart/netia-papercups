#!/usr/bin/env elixir

# Email Configuration Debug Script
# Run this in your production environment to check email settings

IO.puts("=== EMAIL CONFIGURATION DEBUG ===")
IO.puts("")

# Check MAILER_ADAPTER
mailer_adapter = System.get_env("MAILER_ADAPTER", "NOT SET")
IO.puts("MAILER_ADAPTER: #{mailer_adapter}")

case mailer_adapter do
  "Swoosh.Adapters.Mailgun" ->
    IO.puts("✓ Using Mailgun adapter")
    api_key = System.get_env("MAILGUN_API_KEY")
    domain = System.get_env("DOMAIN")
    IO.puts("MAILGUN_API_KEY: #{if api_key, do: "SET (#{String.length(api_key)} chars)", else: "NOT SET"}")
    IO.puts("DOMAIN: #{domain || "NOT SET"}")
    
  "Swoosh.Adapters.SMTP" ->
    IO.puts("✓ Using SMTP adapter")
    host = System.get_env("SMTP_HOST_ADDR")
    port = System.get_env("SMTP_HOST_PORT")
    username = System.get_env("SMTP_USER_NAME")
    password = System.get_env("SMTP_USER_PWD")
    IO.puts("SMTP_HOST_ADDR: #{host || "NOT SET"}")
    IO.puts("SMTP_HOST_PORT: #{port || "NOT SET"}")
    IO.puts("SMTP_USER_NAME: #{username || "NOT SET"}")
    IO.puts("SMTP_USER_PWD: #{if password, do: "SET", else: "NOT SET"}")
    
  "Swoosh.Adapters.Local" ->
    IO.puts("⚠️  Using Local adapter (development only)")
    IO.puts("This will NOT send real emails in production!")
    
  _ ->
    IO.puts("❌ Unknown or missing MAILER_ADAPTER")
end

IO.puts("")

# Check email validation
disable_check = System.get_env("DISABLE_EMAIL_VALIDITY_CHECK")
IO.puts("DISABLE_EMAIL_VALIDITY_CHECK: #{disable_check || "NOT SET (default: false)"}")

IO.puts("")

# Check FROM_ADDRESS
from_address = System.get_env("FROM_ADDRESS")
IO.puts("FROM_ADDRESS: #{from_address || "NOT SET"}")

IO.puts("")

# Check environment
mix_env = System.get_env("MIX_ENV")
IO.puts("MIX_ENV: #{mix_env || "NOT SET"}")

IO.puts("")
IO.puts("=== RECOMMENDATIONS ===")

case mailer_adapter do
  "Swoosh.Adapters.Local" ->
    IO.puts("❌ CRITICAL: You're using Local adapter in production!")
    IO.puts("   Set MAILER_ADAPTER to either:")
    IO.puts("   - Swoosh.Adapters.Mailgun (recommended)")
    IO.puts("   - Swoosh.Adapters.SMTP")
    
  "NOT SET" ->
    IO.puts("❌ CRITICAL: MAILER_ADAPTER is not set!")
    IO.puts("   Set MAILER_ADAPTER to either:")
    IO.puts("   - Swoosh.Adapters.Mailgun (recommended)")
    IO.puts("   - Swoosh.Adapters.SMTP")
    
  _ ->
    IO.puts("✓ MAILER_ADAPTER is set correctly")
end

IO.puts("")
IO.puts("=== NEXT STEPS ===")
IO.puts("1. Fix MAILER_ADAPTER if needed")
IO.puts("2. Set up email service credentials")
IO.puts("3. Test with: DISABLE_EMAIL_VALIDITY_CHECK=true")
IO.puts("4. Check application logs for email delivery errors")
IO.puts("5. Test password reset functionality")
