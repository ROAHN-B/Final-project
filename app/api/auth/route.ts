// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const {
    mobileNumber,
    firstName,
    lastName,
    state,
    district,
    taluka,
    village,
    language,
    isSignUp,
  } = await req.json();

  if (!mobileNumber) {
    return NextResponse.json(
      { error: "Mobile number is required." },
      { status: 400 }
    );
  }

  try {
    // Check if the user already exists in the database
    let { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("mobile_number", mobileNumber)
      .single();

    // A select error is only a true error if it's not 'PGRST116' (which means no rows were found)
    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (isSignUp) {
      // --- SIGN UP LOGIC ---
      if (existingUser) {
        return NextResponse.json(
          { error: "Mobile number already registered. Please log in." },
          { status: 409 } // 409 Conflict status
        );
      }

      // If user doesn't exist, create a new record
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          mobile_number: mobileNumber,
          first_name: firstName,
          last_name: lastName,
          state,
          district,
          taluka,
          village,
          language,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return NextResponse.json(newUser);
    } else {
      // --- LOGIN LOGIC ---
      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found. Please sign up." },
          { status: 404 }
        );
      }
      return NextResponse.json(existingUser);
    }
  } catch (error: any) {
    console.error("Authentication API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred on the server." },
      { status: 500 }
    );
  }
}