# Technical Specifications

This document provides detailed technical specifications for the KrishiMitra project.

## Technology Stack

### Frontend

| Technology        | Version/Details                               |
| ----------------- | --------------------------------------------- |
| **Framework**     | Next.js 14.2.16                               |
| **Language**      | TypeScript 5                                  |
| **UI Library**    | React 18                                      |
| **Styling**       | Tailwind CSS 4.1.9 with `tailwindcss-animate` |
| **UI Components** | Shadcn/UI                                     |
| **State Mgt.**    | React Context API                             |
| **Forms**         | React Hook Form with Zod for validation       |
| **Icons**         | Lucide React                                  |

### Backend & Services

| Service               | Details                                   |
| --------------------- | ----------------------------------------- |
| **Backend-as-a-Service** | Supabase                                  |
| **Database**          | Supabase (PostgreSQL)                     |
| **Authentication**    | Supabase Auth                             |
| **Storage**           | Supabase Storage                          |
| **AI/ML**             | Google Generative AI (`@google/generative-ai`) |

## Project Structure

Here is an overview of the main directories in the project:

-   `app/`: Contains the main application pages and routing logic for the Next.js app. Each folder represents a route.
-   `components/`: Contains reusable React components used throughout the application.
    -   `ui/`: Contains the Shadcn/UI components.
-   `contexts/`: Contains React Context providers for managing global state (e.g., authentication, language).
-   `hooks/`: Contains custom React hooks.
-   `lib/`: Contains utility functions and library configurations.
-   `public/`: Contains static assets like images and fonts.
-   `styles/`: Contains global CSS styles.
-   `docs/`: Contains all project documentation.
-   `AI_RULES.md`: Contains the ethical and functional rules for the AI.