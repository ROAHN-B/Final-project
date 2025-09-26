# Installation Guide

This guide provides instructions on how to set up the KrishiMitra project for local development.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [pnpm](https://pnpm.io/)
-   A [Supabase](https://supabase.com/) account
-   A [Google AI](https://ai.google/) API key

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables. You can get these values from your Supabase and Google AI dashboards.

    ```
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

    # Google AI
    NEXT_PUBLIC_GEMINI_API_KEY=your-google-ai-api-key
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application should now be running at `http://localhost:3000`.