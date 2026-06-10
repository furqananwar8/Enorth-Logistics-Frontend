import { z } from "zod";

export const companyRatesSchema = z.object({
  ftlAmount: z.coerce
    .number()
    .min(0, "FTL Amount must be greater than or equal to 0"),

  ltlAmount: z.coerce
    .number()
    .min(0, "LTL Amount must be greater than or equal to 0"),
});

export type CompanyRatesFormValues = z.input<typeof companyRatesSchema>;
export type CompanyRatesPayload = z.output<typeof companyRatesSchema>;