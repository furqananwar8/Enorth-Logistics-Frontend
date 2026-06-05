"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

declare global {
  interface Window {
    Square: any;
  }
}

export default function AddCardForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const cardRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

const initializedRef = useRef(false);

useEffect(() => {
  const initializeCard = async () => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    if (!window.Square || !cardContainerRef.current) return;

    const payments = window.Square.payments(
      process.env.NEXT_PUBLIC_SQUARE_APP_ID,
      process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
    );

    const card = await payments.card();

    await card.attach(cardContainerRef.current);

    cardRef.current = card;
  };

  initializeCard();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardRef.current) return;

    try {
      setLoading(true);

      const result = await cardRef.current.tokenize();

      if (result.status !== "OK") {
        throw new Error("Card tokenization failed");
      }

      const token = result.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            nonce: token,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to save card");
      }

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 flex flex-col gap-4">
      <div ref={cardContainerRef} />

      <div className="flex gap-2 my-2">
        <Button
          type="button"
          variant="outline"
          className="w-24"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin" />}
          Add New Card
        </Button>
      </div>
    </form>
  );
}
