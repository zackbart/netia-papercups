# System Architecture

## Overview

Netia is a real-time customer support platform built with **Elixir/Phoenix** (backend) and **React/TypeScript** (frontend). The system uses WebSockets for real-time messaging, integrates with LLMs for automated responses, and supports multiple communication channels.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web App<br/>React/TypeScript]
        Widget[Chat Widget<br/>Embedded JS]
        Mobile[Mobile App]
    end
    
    subgraph "Application Layer"
        Phoenix[Phoenix Server<br/>Port 4000]
        CRA[Create React App<br/>Port 3000]
    end
    
    subgraph "Real-Time Layer"
        Channels[Phoenix Channels<br/>WebSockets]
        PubSub[PubSub<br/>Redis]
        Presence[Presence<br/>Online Status]
    end
    
    subgraph "Background Processing"
        Oban[Oban Workers<br/>Job Queue]
        Queues[Job Queues<br/>default/events/mailers]
    end
    
    subgraph "External Services"
        OpenAI[OpenAI API<br/>LLM Responses]
        Slack[Slack API]
        Gmail[Gmail API]
        Twilio[Twilio API]
        Railway[Railway<br/>PostgreSQL]
    end
    
    Web -->|HTTP/WebSocket| Phoenix
    Widget -->|WebSocket| Channels
    Mobile -->|HTTP/WebSocket| Phoenix
    Phoenix -->|Real-time| Channels
    Channels --> PubSub
    PubSub --> Presence
    Phoenix --> Oban
    Oban --> Queues
    Phoenix -->|LLM Requests| OpenAI
    Phoenix -->|Integrations| Slack
    Phoenix -->|Email| Gmail
    Phoenix -->|SMS| Twilio
    Phoenix -->|Database| Railway
    Oban -->|Async Tasks| Slack
    Oban -->|Async Tasks| Gmail
```

## Application Structure

### Backend Components

```mermaid
graph LR
    subgraph "Supervision Tree"
        Repo[Ecto Repo]
        PubSub[Phoenix PubSub]
        Endpoint[Phoenix Endpoint]
        Oban[Oban Workers]
        Presence[Presence]
    end
    
    subgraph "Core Modules"
        Accounts[Accounts<br/>Multi-tenancy]
        Conversations[Conversations<br/>Thread Management]
        Messages[Messages<br/>Content Storage]
        Customers[Customers<br/>Contact Management]
        Users[Users<br/>Agent Management]
    end
    
    subgraph "Features"
        LLM[LLM Integration<br/>OpenAI Client]
        Integrations[Third-party APIs<br/>Slack/Gmail/etc.]
        Workers[Background Jobs<br/>Email/Notifications]
    end
    
    Repo --> Accounts
    Repo --> Conversations
    Repo --> Messages
    Repo --> Customers
    Repo --> Users
    Messages --> LLM
    Conversations --> Integrations
    Endpoint --> Workers
```

### Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Endpoint
    participant Router
    participant Controller
    participant Context
    participant Repo
    participant Channel
    participant PubSub
    
    Client->>Endpoint: HTTP/WebSocket Request
    Endpoint->>Router: Route Request
    Router->>Controller: Handle Action
    
    alt REST API Request
        Controller->>Context: Business Logic
        Context->>Repo: Database Query
        Repo-->>Context: Data
        Context-->>Controller: Result
        Controller-->>Client: JSON Response
    else WebSocket Message
        Controller->>Channel: Handle Event
        Channel->>Context: Process Message
        Context->>Repo: Save Message
        Channel->>PubSub: Broadcast Update
        PubSub-->>Client: Real-time Event
    end
```

## Technology Stack

### Backend
- **Elixir 1.14.5** - Functional programming language
- **Erlang/OTP 24.3.4.13** - Fault-tolerant runtime
- **Phoenix** - Web framework with LiveView
- **Ecto** - Database wrapper and query builder
- **PostgreSQL** - Primary database (hosted on Railway)
- **Redis** - PubSub for distributed messaging (optional)

### Frontend
- **React** with **TypeScript** - UI framework
- **Create React App** - Build tooling
- **Phoenix Channels** - WebSocket client library
- **Phoenix LiveView** - Server-rendered React components

### Infrastructure
- **Railway** - Hosting and managed PostgreSQL
- **Docker** - Production containerization
- **Oban** - Background job processing
- **asdf** - Development tool version management

## Data Model

### Core Entities

```mermaid
erDiagram
    Account ||--o{ Conversation : has
    Account ||--o{ User : has
    Account ||--o{ Customer : has
    Account ||--o{ Inbox : has
    Account ||--o{ BusinessContext : has
    
    Conversation ||--o{ Message : contains
    Conversation }o--|| Customer : belongs_to
    Conversation }o--o| User : assigned_to
    Conversation }o--|| Inbox : in
    
    Message }o--|| Conversation : belongs_to
    Message }o--o| Customer : from_customer
    Message }o--o| User : from_user
    
    Customer ||--o{ Conversation : creates
    
    User ||--o{ Message : sends
    User ||--o{ Conversation : assigned
```

### Key Relationships

- **Account**: Multi-tenant isolation (one account = one company)
- **User**: Agents/staff members who respond to conversations
- **Customer**: End-users who initiate conversations
- **Conversation**: Thread of messages between customer and agents
- **Message**: Individual message within a conversation
- **Inbox**: Routing channel (e.g., "General Support", "Sales")
- **BusinessContext**: LLM context for AI responses

## Real-Time Communication

### WebSocket Architecture

```mermaid
graph TB
    subgraph "Channels"
        ConvChannel[conversation:ID<br/>Per-conversation]
        NotifChannel[notification:ACCOUNT_ID<br/>Account-wide]
        RoomChannel[room:ACCOUNT_ID<br/>Presence tracking]
        EventChannel[events:ACCOUNT_ID<br/>System events]
    end
    
    subgraph "Client Types"
        Customer[Customer Widget<br/>Unauthenticated]
        Agent[Agent Dashboard<br/>Authenticated]
    end
    
    subgraph "Events"
        Shout[shout<br/>New message]
        Typing[typing<br/>Typing indicator]
        Update[conversation:updated<br/>Status change]
        Presence[presence_state<br/>Online status]
    end
    
    Customer -->|Joins| ConvChannel
    Agent -->|Joins| NotifChannel
    Agent -->|Joins| RoomChannel
    ConvChannel --> Shout
    ConvChannel --> Typing
    NotifChannel --> Update
    RoomChannel --> Presence
```

### Channel Topics

- `conversation:{conversation_id}` - Real-time updates for specific conversation
- `notification:{account_id}` - Account-wide notifications for agents
- `room:{account_id}` - Presence tracking (who's online)
- `events:{account_id}` - System events and webhooks
- `issue:{issue_id}` - Issue tracking updates

## Background Processing

### Oban Workers

```mermaid
graph LR
    subgraph "Queues"
        Default[default<br/>General jobs]
        Events[events<br/>Real-time events]
        Mailers[mailers<br/>Email sending]
    end
    
    subgraph "Worker Types"
        Email[Send Emails<br/>Notifications/Replies]
        Sync[Sync Integrations<br/>Gmail/Slack]
        Archive[Archive Conversations<br/>Cleanup]
        LLM[Process LLM<br/>Async AI]
        Reminders[Send Reminders<br/>Conversations]
    end
    
    subgraph "Scheduled Jobs"
        Cron[Gmail Sync<br/>Every minute]
        Hourly[Archive Stale<br/>Hourly]
        Daily[Newsletter<br/>Daily]
    end
    
    Default --> Email
    Default --> Sync
    Events --> LLM
    Mailers --> Email
    Cron --> Sync
    Hourly --> Archive
    Daily --> Reminders
```

### Common Workers

- **SendConversationReplyEmail** - Email notifications for unread messages
- **SyncGmailInboxes** - Sync Gmail conversations
- **SendPushNotifications** - Push notifications to agents
- **ProcessSesEvent** - Process AWS SES email events
- **ArchiveStaleClosedConversations** - Cleanup old conversations

## Deployment Architecture

### Production Setup

```mermaid
graph TB
    subgraph "Railway Platform"
        RailwayApp[Railway App<br/>Container]
        RailwayDB[PostgreSQL<br/>Managed]
        RailwayRedis[Redis<br/>Optional]
    end
    
    subgraph "Container"
        Dockerfile[Dockerfile<br/>Multi-stage build]
        Entrypoint[docker-entrypoint.sh<br/>Migration & Start]
        PhoenixApp[Phoenix App<br/>Release]
    end
    
    subgraph "External Services"
        OpenAI_Ext[OpenAI API]
        Slack_Ext[Slack API]
        Gmail_Ext[Gmail API]
    end
    
    Dockerfile --> Entrypoint
    Entrypoint --> PhoenixApp
    RailwayApp --> RailwayDB
    RailwayApp --> RailwayRedis
    RailwayApp --> OpenAI_Ext
    RailwayApp --> Slack_Ext
    RailwayApp --> Gmail_Ext
```

### Deployment Flow

1. **Git Push** → GitHub
2. **Railway** detects changes
3. **Docker Build** from `Dockerfile`:
   - Builds React frontend (`npm run build`)
   - Compiles Elixir/Phoenix (`mix release`)
   - Creates production release
4. **Container Start**:
   - Runs migrations (`db migrate`)
   - Starts Phoenix server (`run`)
5. **Live** - Application available

### Environment

- **Development**: Native Phoenix + CRA dev servers
- **Production**: Dockerized release on Railway
- **Database**: Railway managed PostgreSQL (dev & prod)

## Scalability Considerations

- **PubSub**: Redis-backed for multi-node deployment
- **Database**: PostgreSQL with connection pooling
- **Background Jobs**: Oban with queue-based processing
- **Real-time**: Phoenix Channels scale horizontally with Redis PubSub
- **LLM**: Async processing to avoid blocking requests
- **File Storage**: AWS S3 for uploaded files

