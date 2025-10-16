// app/api/youtube-search/route.ts

import { NextRequest, NextResponse } from 'next/server';

// NOTE: You must get an API Key for either the Google Search Custom Search API 
// or the YouTube Data API and save it as an environment variable (e.g., YOUTUBE_API_KEY).
// CORRECT WAY: Access the environment variable named YOUTUBE_API_KEY
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 

// The value of YOUTUBE_API_KEY is now "AIzaSyA7X5t1nHXlQhl4ZbXRwNycoIJK_vpWifs" (the string)

if (!YOUTUBE_API_KEY) {
    // Handle the error if the key isn't loaded
    console.error("YOUTUBE_API_KEY is missing!");
}

export async function POST(req: NextRequest) {
    if (!YOUTUBE_API_KEY) {
        return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const { query } = await req.json();

    if (!query) {
        return NextResponse.json({ error: "Missing search query" }, { status: 400 });
    }

    // Use the official YouTube Data API (v3) for reliable video searching
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video&regionCode=IN&videoEmbeddable=true`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        // Check for search results
        const video = data.items?.find((item: any) => item.id.kind === 'youtube#video');

        if (video) {
            return NextResponse.json({
                success: true,
                videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                title: video.snippet.title,
            });
        } else {
            return NextResponse.json({ success: false, message: "No video found for query." });
        }
    } catch (error) {
        console.error('YouTube API Error:', error);
        return NextResponse.json({ error: "Failed to fetch video from YouTube." }, { status: 500 });
    }
}