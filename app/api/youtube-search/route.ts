// app/api/youtube-search/route.ts

import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 

if (!YOUTUBE_API_KEY) {
    console.error("YOUTUBE_API_KEY is missing!");
}

// 1. DEFINE INTERFACE FOR THE REQUEST BODY to fix the 'any' type error
interface SearchRequestBody {
    queries: string[];
}

const TRUSTED_CHANNEL_KEYWORDS = "Krishi Darshan | ICAR | KVK | Kisan | Agriculture Department | Agriculture University | Farming Guide";

type VideoResult = {
    videoUrl: string; 
    title: string;
};

// Helper function to fetch a single high-quality video for one query
async function fetchSingleVideo(query: string): Promise<VideoResult | null> {
    if (!YOUTUBE_API_KEY) return null;
    
    const combinedQuery = `${query} (${TRUSTED_CHANNEL_KEYWORDS})`;

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(combinedQuery)}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video&regionCode=IN&videoEmbeddable=true&videoDuration=medium&order=relevance&safeSearch=strict`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (!response.ok || data.error) {
             console.error('YouTube API Search Error:', data.error);
             return null;
        }

        const video = data.items?.find((item: any) => item.id.kind === 'youtube#video');

        if (video) {
            return {
                videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                title: video.snippet.title,
            };
        }
        return null;
    } catch (error) {
        console.error('YouTube API Fetch Error:', error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    if (!YOUTUBE_API_KEY) {
        return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    // 2. USE THE INTERFACE TO TYPE THE JSON RESULT
    const { queries } = await req.json() as SearchRequestBody; 

    if (!Array.isArray(queries) || queries.length === 0) {
        return NextResponse.json({ error: "Missing or invalid search queries array" }, { status: 400 });
    }
    
    // Process a maximum of 3 queries to avoid excessive API usage
    const limitedQueries = queries.slice(0, 3);

    // Run all searches concurrently and wait for all results
    const resultsPromises = limitedQueries.map(query => fetchSingleVideo(query));
    const settledResults = await Promise.allSettled(resultsPromises);

    const successfulVideos = settledResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => (result as PromiseFulfilledResult<VideoResult>).value);

    if (successfulVideos.length > 0) {
        return NextResponse.json({
            success: true,
            videos: successfulVideos, // Return an array of video objects
        });
    } else {
        return NextResponse.json({ success: false, message: "No suitable videos found for the queries." });
    }
}