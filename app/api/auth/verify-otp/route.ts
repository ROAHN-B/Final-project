// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function POST(req: NextRequest) {
    const { mobileNumber, otp } = await req.json();
    if (!mobileNumber || !otp) {
        return NextResponse.json({ error: "Mobile number and OTP are required." }, { status: 400 });
    }

    const formattedPhone = `+91${mobileNumber}`;
    try {
        // 1. Verify the OTP with Twilio
        const response = await fetch(`https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
            },
            body: new URLSearchParams({
                To: formattedPhone,
                Code: otp
            })
        });

        const data = await response.json();
        if (!response.ok || data.status !== 'approved') {
            throw new Error(data.message || "Invalid OTP.");
        }

        // 2. If Twilio verification is successful, fetch the user profile from your database
        const { data: userProfile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("mobile_number", mobileNumber)
            .single();

        if (profileError || !userProfile) {
            return NextResponse.json({ error: "Could not retrieve user profile after verification." }, { status: 500 });
        }
        
        // You might want to create a Supabase session here if needed, but for now, just return the profile.
        return NextResponse.json(userProfile);

    } catch (error: any) {
        console.error("Twilio Verify check error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

