// File: app/api/save-manual-soil-data/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
    try {
        const { manualFormData, userId } = await req.json(); // Changed from phoneNumber

        if (!manualFormData) {
            return NextResponse.json({ error: "No soil data provided." }, { status: 400 });
        }
        if (!userId) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        // Prepare data for the new structured table
        const reportData = {
            user_id: userId,
            report_type: 'manual',
            ph: manualFormData.ph,
            ec: manualFormData.ec,
            oc: manualFormData.organicCarbon, // Map from frontend camelCase
            n: manualFormData.nitrogen,
            p: manualFormData.phosphorus,
            k: manualFormData.potassium,
            s: manualFormData.sulfur,
            ca: manualFormData.calcium,
            mg: manualFormData.magnesium,
            zn: manualFormData.zinc,
            b: manualFormData.boron,
            fe: manualFormData.iron,
            mn: manualFormData.manganese,
            cu: manualFormData.cu,
        };

        const { error: insertError } = await supabase.from('soil_reports').insert(reportData);

        if (insertError) {
            console.error("Supabase insert error (manual_soil_data):", insertError);
            throw new Error("Failed to save data to the database.");
        }

        return NextResponse.json({ success: true, message: "Soil data saved successfully." });

    } catch (error: any) {
        console.error("Error submitting manual soil data:", error);
        return NextResponse.json(
            { error: error.message || "Failed to submit manual soil data." },
            { status: 500 }
        );
    }
}