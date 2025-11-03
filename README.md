**:warning: Maintenance Mode**

> _Netia is in maintenance mode. This means there won't be any major new features in the near future. We will still accept pull requests and conduct major bug fixes._

# Netia

Netia is an open source live customer support tool web app written in Elixir. We offer a hosted version at [app.netia.io](https://app.netia.io/).

You can check out how our chat widget looks and play around with customizing it on our [demo page](https://app.netia.io/demo/). The chat widget component is also open sourced at [github.com/netia-io/chat-widget](https://github.com/netia-io/chat-widget).

_Watch how easy it is to get set up with our Slack integration 🚀 :_
![slack-setup](https://user-images.githubusercontent.com/4218509/88716918-a0583180-d0d4-11ea-93b3-12437ac51138.gif)

## Development Setup

### Prerequisites

- **[asdf](https://asdf-vm.com/)** (recommended) - Tool version manager for Erlang, Elixir, Node.js
  ```bash
  brew install asdf  # macOS
  ```
- Or install directly:
  - **Erlang** 24.3.4.13
  - **Elixir** 1.14.5-otp-24
  - **Node.js** 18.20.4
  - **PostgreSQL** (optional - we use Railway Postgres for local dev)

The project uses `.tool-versions` to specify exact versions when using asdf.

### Quick Start

```bash
# 1) Copy environment template
cp .env.example .env
# Edit .env with your Railway Postgres DATABASE_URL and other config

# 2) One-time setup (installs dependencies, sets up database)
./dev.sh setup

# 3) Start development servers
./dev.sh start
```

The app will be running at:
- **Frontend**: http://localhost:3000 (CRA dev server)
- **API**: http://localhost:4000 (Phoenix server)

For detailed development instructions, see **[📖 Development Guide](docs/development.md)**

## Deployment

This project is configured for deployment on [Railway](https://railway.app). Railway automatically:
- Detects the `Dockerfile` for production builds
- Runs database migrations on deployment
- Manages PostgreSQL via `DATABASE_URL` environment variable

To deploy:
1. Connect your GitHub repository to Railway
2. Configure environment variables (see `.env.example` for required variables)
3. Push to your main branch to trigger automatic deployments

## Philosophy

We wanted to make a self-hosted customer support tool like Zendesk and Intercom for companies that have privacy and security concerns about having customer data going to third party services.

## Features

- **Reply from email** - use Papercups to answer support tickets via email
- **Reply from SMS** - forward Twilio conversations and respond to SMS requests from Papercups
- **Custom chat widget** - a customizable chat widget you can embed on your website to talk to your customers
- **React support** - embed the chat widget as a [React component](https://github.com/papercups-io/chat-widget#using-in-react), or a simple [HTML snippet](https://github.com/papercups-io/chat-widget#using-in-html)
- **React Native support** - embed the chat widget in your [React Native](https://github.com/papercups-io/chat-widget-native#papercups-iochat-widget-native) app
- **Flutter support** - embed the chat widget in your [Flutter](https://github.com/papercups-io/papercups_flutter) app (courtesy of @aguilaair :heart:)
- **Slack integration** - connect with Slack, so you can view and reply to messages directly from a Slack channel
- **Mattermost integration** - connect with [Mattermost](https://docs.papercups.io/reply-from-mattermost), so you can view and reply to messages directly from Mattermost
- **Markdown and emoji support** - use markdown and emoji to add character to your messages!
- **Invite your team** - send invite links to your teammates to join your account
- **Conversation management** - close, assign, and prioritize conversations
- **Built on Elixir** - optimized for responsiveness, fault-tolerance, and support for realtime updates

## Tech Stack

**Backend:**
- **Elixir** 1.14.5 with **Erlang/OTP** 24.3.4.13
- **Phoenix** - Web framework with LiveView for real-time updates
- **Ecto** - Database wrapper and query library
- **PostgreSQL** - Database (hosted on Railway)

**Frontend:**
- **React** with **TypeScript**
- **Create React App** - Build tooling
- **Phoenix Channels** - WebSocket connections for real-time features

**DevOps & Deployment:**
- **Railway** - Hosting and database
- **Docker** - Production containerization
- **asdf** - Development tool version management

**Development Tools:**
- Hot reload for both Elixir and React code
- Native development workflow (no Docker for local dev)
- `dev.sh` - Unified development script

## Demo

Check out our [demo page](https://app.netia.io/demo/) to see the chat widget in action and customize it to your needs.

## Documentation

- **[Development Guide](docs/development.md)** - Complete setup and development instructions
- **[LLM Cost Analysis](docs/llm-cost-analysis.md)** - Analysis of LLM usage and costs

## Contributing

We :heart: contributions big or small. For local development setup, see the [Development Guide](docs/development.md) to get started.

## Thanks to all of our contributors!

<td>
<a href="https://github.com/reichert621"><img src="https://avatars0.githubusercontent.com/u/5264279?v=4" title="reichert621" width="80" height="80"></a>
<a href="https://github.com/cheeseblubber"><img src="https://avatars0.githubusercontent.com/u/4218509?v=4" title="cheeseblubber" width="80" height="80"></a>
<a href="https://github.com/jalford14"><img src="https://avatars0.githubusercontent.com/u/7582183?v=4" title="jalford14" width="80" height="80"></a>
<a href="https://github.com/ZmagoD"><img src="https://avatars0.githubusercontent.com/u/7046787?v=4" title="ZmagoD" width="80" height="80"></a>
<a href="https://github.com/raditya3"><img src="https://avatars1.githubusercontent.com/u/25644166?v=4" title="raditya3" width="80" height="80"></a>
<a href="https://github.com/eikooc"><img src="https://avatars1.githubusercontent.com/u/1305015?v=4" title="eikooc" width="80" height="80"></a>
<a href="https://github.com/daskycodes"><img src="https://avatars1.githubusercontent.com/u/19915462?v=4" title="daskycodes" width="80" height="80"></a>
<a href="https://github.com/rberrelleza"><img src="https://avatars0.githubusercontent.com/u/475313?v=4" title="rberrelleza" width="80" height="80"></a>
<a href="https://github.com/kamilpikula"><img src="https://avatars1.githubusercontent.com/u/23015380?v=4" title="kamilpikula" width="80" height="80"></a>
<a href="https://github.com/alisinabh"><img src="https://avatars1.githubusercontent.com/u/16141016?v=4" title="alisinabh" width="80" height="80"></a>
<a href="https://github.com/estevanjantsk"><img src="https://avatars2.githubusercontent.com/u/461342?v=4" title="estevanjantsk" width="80" height="80"></a>
<a href="https://github.com/lukewaring"><img src="https://avatars0.githubusercontent.com/u/33970417?v=4" title="lukewaring" width="80" height="80"></a>
<a href="https://github.com/m1ome"><img src="https://avatars3.githubusercontent.com/u/5213243?v=4" title="m1ome" width="80" height="80"></a>
<a href="https://github.com/rlanga"><img src="https://avatars1.githubusercontent.com/u/18057958?v=4" title="rlanga" width="80" height="80"></a>
<a href="https://github.com/WLSF"><img src="https://avatars3.githubusercontent.com/u/5873073?v=4" title="WLSF" width="80" height="80"></a>
<a href="https://github.com/adipurnama"><img src="https://avatars1.githubusercontent.com/u/319621?v=4" title="adipurnama" width="80" height="80"></a>
<a href="https://github.com/Oddadmix"><img src="https://avatars3.githubusercontent.com/u/1205162?v=4" title="Oddadmix" width="80" height="80"></a>
<a href="https://github.com/edgrknye"><img src="https://avatars2.githubusercontent.com/u/70431172?v=4" title="edgrknye" width="80" height="80"></a>
<a href="https://github.com/ezhao"><img src="https://avatars2.githubusercontent.com/u/5169628?v=4" title="ezhao" width="80" height="80"></a>
<a href="https://github.com/henrymori"><img src="https://avatars2.githubusercontent.com/u/782219?v=4" title="henrymori" width="80" height="80"></a>
<a href="https://github.com/joelazwar"><img src="https://avatars0.githubusercontent.com/u/43277890?v=4" title="joelazwar" width="80" height="80"></a>
<a href="https://github.com/jonathanyeong"><img src="https://avatars2.githubusercontent.com/u/3861088?v=4" title="jonathanyeong" width="80" height="80"></a>
<a href="https://github.com/lingster"><img src="https://avatars3.githubusercontent.com/u/850493?v=4" title="lingster" width="80" height="80"></a>
<a href="https://github.com/sbacarob"><img src="https://avatars1.githubusercontent.com/u/8399424?v=4" title="sbacarob" width="80" height="80"></a>
<a href="https://github.com/shivamls"><img src="https://avatars0.githubusercontent.com/u/40359923?v=4" title="shivamls" width="80" height="80"></a>
<a href="https://github.com/sykrish"><img src="https://avatars0.githubusercontent.com/u/5038458?v=4" title="sykrish" width="80" height="80"></a>
<a href="https://github.com/flmel"><img src="https://avatars1.githubusercontent.com/u/55487633?v=4" title="flmel" width="80" height="80"></a>
<a href="https://github.com/lorecrafting"><img src="https://avatars1.githubusercontent.com/u/4595918?v=4" title="lorecrafting" width="80" height="80"></a>
<a href="https://github.com/webdeb"><img src="https://avatars3.githubusercontent.com/u/14992140?v=4" title="webdeb" width="80" height="80"></a>
</td>

## License

MIT © Papercups
