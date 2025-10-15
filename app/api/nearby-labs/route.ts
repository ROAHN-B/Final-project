// app/api/nearby-labs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY_GUIDANCE) { // Reusing an existing key
  throw new Error("A valid GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_GUIDANCE);

// Helper function to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// NEW: Function to translate lab data using Gemini
async function translateLabData(labs: any[], lang: string): Promise<any[]> {
  if (!labs || labs.length === 0 || lang === 'en') return labs;

  const languageMap: { [key: string]: string } = {
    hi: 'Hindi',
    mr: 'Marathi',
    pa: 'Punjabi',
    kn: 'Kannada',
    ta: 'Tamil',
  };
  const targetLanguage = languageMap[lang] || 'English';

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // Create a clean JSON array without the distance property for translation
  const dataToTranslate = labs.map(({ name, address, lat, lon }) => ({ name, address, lat, lon }));

  const prompt = `Translate the 'name' and 'address' values in the following JSON array into ${targetLanguage}. Maintain the exact JSON structure and keys. Provide ONLY the translated JSON array as your response, without any markdown formatting.\n\n${JSON.stringify(dataToTranslate)}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const translatedLabs = JSON.parse(responseText);
    
    // Re-attach the distance property to the translated data
    return translatedLabs.map((lab: any, index: number) => ({
      ...lab,
      distance: labs[index].distance,
    }));
  } catch (error) {
    console.error("Failed to translate lab data, returning original.", error);
    return labs; // Return original data on translation failure
  }
}

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude, lang } = await req.json();

    if (!latitude || !longitude || !lang) {
      return NextResponse.json({ error: "Latitude, longitude, and language are required." }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=soil+testing+laboratory&format=json&lat=${latitude}&lon=${longitude}&radius=10000&countrycodes=in&limit=10`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'KrishiMitra Agricultural App' }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch nearby labs from OpenStreetMap.");
    }
    const data = await response.json();

    let labs = data.map((place: any) => ({
      name: place.display_name.split(',')[0],
      address: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      distance: calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon))
    }));

    labs.sort((a: any, b: any) => a.distance - b.distance);
    
    // NEW: Translate the results before sending them to the client
    const translatedLabs = await translateLabData(labs, lang);

    return NextResponse.json(translatedLabs);

  } catch (error: any) {
    console.error("Error fetching nearby labs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
