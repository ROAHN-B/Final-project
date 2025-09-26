# Architecture

This document outlines the technical architecture of the KrishiMitra application.

## System Architecture

The application is built using a modern, decoupled architecture. The frontend is a Next.js application, which communicates with a Supabase backend for data storage, authentication, and other services. The AI-powered features are integrated using the Google Generative AI API.

```mermaid
graph TD
    A[User] --> B["Frontend (Next.js)"];
    B --> C["Supabase"];
    B --> D["Google Generative AI"];
    C --> E[Database];
    C --> F[Authentication];
    C --> G[Storage];

    subgraph "Frontend"
        B
    end

    subgraph "Backend Services"
        C
        D
    end

    subgraph "Supabase Services"
        E
        F
        G
    end
```

## Data Flow

The data flow is designed to be secure and efficient. User data is handled by Supabase, while AI-related data is processed by Google's services.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase
    participant GoogleAI

    User->>Frontend: Uploads image for diagnosis
    Frontend->>Supabase: Stores image metadata
    Frontend->>GoogleAI: Sends image for analysis
    GoogleAI-->>Frontend: Returns diagnosis
    Frontend-->>User: Displays diagnosis
```

## Component Interactions

The frontend is built with a component-based architecture, using React and Shadcn/UI components.

```mermaid
graph TD
    subgraph "Pages"
        A[Dashboard]
        B[Diagnose Page]
        C[Market Page]
    end

    subgraph "Shared Components"
        D[Header]
        E[BottomNavigation]
        F[LanguageSelector]
    end

    subgraph "UI Components (Shadcn/UI)"
        G[Card]
        H[Button]
        I[Carousel]
    end

    A --> D & E & F;
    B --> D & E & F;
    C --> D & E & F;

    A --> G & H;
    B --> G & H & I;
    C --> G & H;
```

## Frontend

-   **Framework:** Next.js (React)
-   **Styling:** Tailwind CSS with Shadcn/UI
-   **State Management:** React Context API
-   **Forms:** React Hook Form with Zod for validation

## Backend

-   **Database:** Supabase (PostgreSQL)
-   **Authentication:** Supabase Auth
-   **Storage:** Supabase Storage
-   **AI:** Google Generative AI

## AI Integration

The application integrates with Google Generative AI for features like crop disease diagnosis. The communication is handled via API calls from the frontend.