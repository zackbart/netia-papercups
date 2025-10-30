defmodule ChatApiWeb.CacheBodyReader do
  @moduledoc false

  @doc """
  Body reader used by Plug.Parsers to capture the raw request body
  (needed for Stripe webhook signature verification) while still
  allowing the body to be parsed normally afterwards.
  """
  def read_body(conn, opts) do
    case Plug.Conn.read_body(conn, opts) do
      {:ok, body, conn} ->
        conn = Plug.Conn.assign(conn, :raw_body, body)
        {:ok, body, conn}

      {:more, part, conn} ->
        # Streamed bodies: accumulate in assigns
        existing = conn.assigns[:raw_body] || ""
        conn = Plug.Conn.assign(conn, :raw_body, existing <> part)
        {:more, part, conn}
    end
  end
end


