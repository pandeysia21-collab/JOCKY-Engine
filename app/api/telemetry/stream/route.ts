import { NextRequest } from 'next/server';
import { subscribeTelemetry, getTelemetrySnapshot } from '@/lib/telemetryStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    start(controller) {
      // Send initial snapshot immediately
      const initial = getTelemetrySnapshot();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));

      // Subscribe to subsequent batches
      const unsubscribe = subscribeTelemetry((updatedData) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(updatedData)}\n\n`));
        } catch (e) {
          // Client closed connection
        }
      });

      // Keepalive ping every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
          unsubscribe();
        }
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    }
  });

  return new Response(customStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
