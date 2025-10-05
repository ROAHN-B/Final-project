// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function POST(req: NextRequest) {
  const { mobileNumber } = await req.json();
  if (!mobileNumber) {
    return NextResponse.json({ error: "Mobile number is required." }, { status: 400 });
  }

  // First, check if user exists, same as before
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("id")
    .eq("mobile_number", mobileNumber)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  if (!userProfile) {
    return NextResponse.json({ error: "This mobile number is not registered. Please sign up." }, { status: 404 });
  }

  // Now, call Twilio Verify API directly
  const formattedPhone = `+91${mobileNumber}`;
  try {
    const response = await fetch(`https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Channel: 'sms'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP via Twilio.');
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully." });
  } catch (error: any) {
    console.error("Twilio Verify send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
