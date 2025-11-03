defmodule ChatApiWeb.ErrorView do
  use ChatApiWeb, :view

  # If you want to customize a particular status code
  # for a certain format, you may uncomment below.
  def render("500.html", _assigns) do
    """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Internal Server Error</title>
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
        <h1>500 - Internal Server Error</h1>
        <p>Something went wrong. Please try again later.</p>
      </div>
    </body>
    </html>
    """
  end

  def render("404.html", _assigns) do
    """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Not Found</title>
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
        <h1>404 - Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    </body>
    </html>
    """
  end

  def render("500.json", _assigns) do
    %{errors: %{detail: "Internal Server Error"}}
  end

  # By default, Phoenix returns the status message from
  # the template name. For example, "404.json" becomes
  # "Not Found".
  def template_not_found(template, _assigns) do
    status = Phoenix.Controller.status_message_from_template(template)
    
    case String.ends_with?(template, ".html") do
      true ->
        """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>#{status}</title>
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
            <h1>#{status}</h1>
            <p>An error occurred.</p>
          </div>
        </body>
        </html>
        """
      
      false ->
        %{errors: %{detail: status}}
    end
  end
end
