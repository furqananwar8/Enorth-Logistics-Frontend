import type {
  ShipmentRatesDto,
  StreamEvent,
  CarrierResult,
} from "../shippinRates.types";
import { SSEParser } from "./sse-parser";

export class StreamInterruptedError extends Error {
  constructor() {
    super("Stream was interrupted");
    this.name = "StreamInterruptedError";
  }
}

export interface StreamCallbacks {
  onCarrier: (result: CarrierResult) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export class ShipmentApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async streamRates(
    dto: ShipmentRatesDto,
    signal: AbortSignal,
    callbacks: StreamCallbacks,
  ): Promise<void> {
    // console.log("process.env.NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment-carriers/rates/stream`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const parser = new SSEParser();

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          const remaining = parser.flush();
          this.dispatchEvents(remaining, callbacks);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const events = parser.feed(chunk);
        this.dispatchEvents(events, callbacks);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new StreamInterruptedError();
      }
      throw error;
    } finally {
      reader.releaseLock();
      parser.reset();
    }
  }

  private dispatchEvents(
    events: StreamEvent[],
    callbacks: StreamCallbacks,
  ): void {
    for (const event of events) {
      if ("done" in event) {
        callbacks.onComplete();
      } else {
        callbacks.onCarrier(event);
      }
    }
  }
}
