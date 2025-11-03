defmodule Mix.Tasks.PatchPow do
  @moduledoc """
  Patches Pow library for OTP 24+ compatibility.

  This task automatically patches Pow's pbkdf2.ex file to use :crypto.mac/4
  instead of the deprecated :crypto.hmac/3 function for OTP 24+ compatibility.
  """
  use Mix.Task

  @shortdoc "Patches Pow for OTP 24+ compatibility"

  @pow_pbkdf2_path "deps/pow/lib/pow/ecto/schema/password/pbkdf2.ex"

  def run(_args) do
    if File.exists?(@pow_pbkdf2_path) do
      case patch_file() do
        :ok ->
          Mix.shell().info("✅ Successfully patched Pow for OTP 24+ compatibility")
          :ok

        {:error, reason} ->
          Mix.shell().error("❌ Failed to patch Pow: #{inspect(reason)}")
          {:error, reason}
      end
    else
      Mix.shell().info("⚠️  Pow not found at #{@pow_pbkdf2_path}. Run `mix deps.get` first.")
    end
  end

  defp patch_file do
    content = File.read!(@pow_pbkdf2_path)

    # Check if already patched
    if String.contains?(content, "# OTP 24+ uses :crypto.mac/4") do
      Mix.shell().info("ℹ️  Pow is already patched")
      :ok
    else
      # Replace the mac_fun function
      patched_content =
        content
        |> String.replace(
          ~r/  defp mac_fun\(digest, secret\) do\s+:crypto\.hmac\(digest, secret, &1\)\s+end/,
          """
  defp mac_fun(digest, secret) do
    # OTP 24+ uses :crypto.mac/4 instead of :crypto.hmac/3
    if function_exported?(:crypto, :mac, 4) do
      &:crypto.mac(:hmac, digest, secret, &1)
    else
      &:crypto.hmac(digest, secret, &1)
    end
  end
""",
          global: false
        )

      if patched_content == content do
        {:error, :pattern_not_found}
      else
        File.write(@pow_pbkdf2_path, patched_content)
        :ok
      end
    end
  end
end

