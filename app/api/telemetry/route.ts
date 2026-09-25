import { NextRequest, NextResponse } from 'next/server';
import { addTelemetryBatch, getTelemetrySnapshot } from '@/lib/telemetryStore';
import { TelemetryBatch } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getTelemetrySnapshot();
    return NextResponse.json({
      success: true,
      data,
      serverTime: new Date().toISOString(),
      engine: "JOCKY-ENGINE-v4.9.2-WIN64"
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TelemetryBatch = await request.json();

    if (!body || !body.telemetry) {
      return NextResponse.json({
        success: false,
        error: "Invalid telemetry payload structure: missing 'telemetry' object"
      }, { status: 400 });
    }

    const updated = addTelemetryBatch(body);

    return NextResponse.json({
      success: true,
      message: "Telemetry ingested successfully into JOCKY Engine kernel store",
      batchId: body.batchId || "UNKNOWN",
      syncedCounts: {
        processes: updated.processes.length,
        ports: updated.ports.length,
        persistence: updated.persistence.length,
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error("[JOCKY-API] Error ingesting telemetry:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error processing forensic telemetry"
    }, { status: 500 });
  }
}
