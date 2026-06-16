"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addClaimComment, getClaimComments } from "@/api/services/claims.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommentsProps {
  claimId: string | null;
}

export default function Comments({ claimId }: CommentsProps) {
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["claim-comments", claimId],
    queryFn: () => getClaimComments(claimId),
    enabled: !!claimId,
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: addClaimComment,
    onSuccess: () => {
      setComment("");

      queryClient.invalidateQueries({
        queryKey: ["claim-comments", claimId],
      });

      toast.success("Comment added successfully");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const handleSubmit = () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setError("Comment is required");
      return;
    }

    if (trimmedComment.length < 3) {
      setError("Comment must be at least 3 characters");
      return;
    }

    setError("");

    addComment({
      claimId: claimId ?? "",
      message: trimmedComment,
    });
  };

  const comments = data?.comments || data || [];
  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);

            if (error) {
              setError("");
            }
          }}
          rows={4}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Adding..." : "Add Comment"}
        </Button>
      </div>

      {/* Comments List */}
      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Comments</h3>

        {isLoading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground">No comments available.</p>
        ) : (
          [...comments].reverse().map((item: any) => (
            <div
              key={item.id}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}

                {/* Name + meta */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 focus-visible:outline-none">
                    <AvatarFallback>
                      {item.addedBy?.firstName.charAt(0)}
                      {item.addedBy?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold leading-none">
                    {item.addedBy?.firstName} {item.addedBy?.lastName}
                  </span>
                </div>
              </div>

              {/* Message bubble */}
              <div className="rounded-lg bg-muted/40 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {item.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
