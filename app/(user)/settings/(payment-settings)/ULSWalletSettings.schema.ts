import { z } from "zod";

export const ulswalletSettingsSchema = z.object({
  primaryCard: z.string().min(1, "Please select a primary card"),
  notifyExpiry: z.boolean().default(false),
  email: z.string().email("Please enter a valid email address").or(z.literal("")),
});

export type ULSWalletSettingsValues = z.infer<typeof ulswalletSettingsSchema>;

export const addCardSchema = z.object({
  nickname: z.string().optional(),
  cardNumber: z.string().min(13, "Invalid card number").max(19),
  expiryDate: z.string().regex(/^\d{2} \/ \d{2}$/, "Format must be MM / YY"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms of service"),
});

export type AddCardFormValues = z.infer<typeof addCardSchema>;

export const topupSchema = z.object({
  amount: z.number().refine((val) => val > 50, "Amount must be greater than 50"),
  currency: z.enum(["cad", "usd"]),
});

export type TopupFormValues = z.infer<typeof topupSchema>;
