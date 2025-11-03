defmodule ChatApiWeb.PageController do
  use ChatApiWeb, :controller

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, _params) do
    # In dev mode, redirect to CRA dev server on port 3000
    # In production, serve compiled static assets from priv/static
    # Check if Mix is available (not available in releases)
    is_dev_mode = Code.ensure_loaded?(Mix) and function_exported?(Mix, :env, 0) and Mix.env() == :dev
    
    if is_dev_mode do
      redirect(conn, external: "http://localhost:3000#{conn.request_path}")
    else
      # Use Application.app_dir to get absolute path (works in releases)
      index_path = Path.join([Application.app_dir(:chat_api), "priv", "static", "index.html"])
      
      case File.read(index_path) do
        {:ok, file} ->
          content = file
      |> String.replace(
        "__SERVER_ENV_DATA__",
        Jason.encode!(server_env_data(), escape: :html_safe)
      )
          html(conn, content)

        {:error, reason} ->
          # Fallback if index.html doesn't exist
          require Logger
          Logger.error("priv/static/index.html not found at #{index_path}: #{inspect(reason)}")
          html(conn, fallback_html())
      end
    end
  end

  defp fallback_html do
    """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Netia</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .container {
          text-align: center;
          padding: 2rem;
        }
        h1 { color: #333; margin: 0 0 1rem 0; }
        p { color: #666; margin: 0.5rem 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Application Starting</h1>
        <p>Please wait while the application initializes.</p>
      </div>
    </body>
    </html>
    """
  end

  defp server_env_data() do
    %{
      # Frontend only
      REACT_APP_SENTRY_DSN: System.get_env("REACT_APP_SENTRY_DSN"),
      REACT_APP_LOGROCKET_ID: System.get_env("REACT_APP_LOGROCKET_ID"),
      REACT_APP_POSTHOG_TOKEN:
        System.get_env("REACT_APP_POSTHOG_TOKEN", "cQo4wipp5ipWWXhTN8kTacBItgqo457yDRtzCMOr-Tw"),
      REACT_APP_POSTHOG_API_HOST:
        System.get_env("REACT_APP_POSTHOG_API_HOST", "https://app.posthog.com"),
      REACT_APP_DEBUG_MODE_ENABLED: System.get_env("REACT_APP_DEBUG_MODE_ENABLED"),
      REACT_APP_EU_EDITION: System.get_env("REACT_APP_EU_EDITION"),
      REACT_APP_URL: System.get_env("REACT_APP_URL", "app.netia.ai"),
      REACT_APP_SLACK_CLIENT_ID:
        System.get_env("REACT_APP_SLACK_CLIENT_ID", "1192316529232.1250363411891"),
      REACT_APP_STRIPE_PUBLIC_KEY: System.get_env("REACT_APP_STRIPE_PUBLIC_KEY"),
      REACT_APP_FILE_UPLOADS_ENABLED: System.get_env("REACT_APP_FILE_UPLOADS_ENABLED"),
      REACT_APP_STORYTIME_ENABLED: System.get_env("REACT_APP_STORYTIME_ENABLED"),
      REACT_APP_ADMIN_ACCOUNT_ID:
        System.get_env("REACT_APP_ADMIN_ACCOUNT_ID", "eb504736-0f20-4978-98ff-1a82ae60b266"),
      REACT_APP_ADMIN_INBOX_ID:
        System.get_env("REACT_APP_ADMIN_INBOX_ID", "1c792b5e-4be9-4e51-98a9-5648311eb398"),
      REACT_APP_GITHUB_APP_NAME: System.get_env("REACT_APP_GITHUB_APP_NAME", "papercups-io"),

      # Shared with backend (none of these should include API keys/secrets!)
      # NB: we prefix everything with `REACT_APP_` so we can override these more easily during development
      # (see https://create-react-app.dev/docs/adding-custom-environment-variables/)
      REACT_APP_USER_INVITATION_EMAIL_ENABLED: System.get_env("USER_INVITATION_EMAIL_ENABLED")
    }
  end
end
