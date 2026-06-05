import * as z from "zod";
// console.log("SCHEMA FILE LOADED");
export const packageUnitSchema = z.object({
  length: z.number("Required").min(1, "Must be > 0"),
  width: z.number("Required").min(1, "Must be > 0"),
  height: z.number("Required").min(1, "Must be > 0"),
  weight: z
    .number("Required")
    .min(1, "Must be > 0")
    .max(5000, "Too heavy for standard quote, please request a spot quote"),
  description: z.string().optional(),
  specialHandlingRequired: z.boolean().optional(),
});

export const courierUnitSchema = z.object({
  weight: z
    .number("Required")
    .min(1, "Must be > 0")
    .max(5000, "Too heavy for standard quote, please request a spot quote"),
  description: z.string().optional(),
});

export const ftlUnitSchema = z.object({
  name: z.enum(["looseFreight", "pallets"], "Required"),
  count: z.number("Required"),
  weight: z
    .number("Required")
    .min(1, "Must be > 0")
    .max(5000, "Too heavy for standard quote, please request a spot quote"),
  description: z.string().optional(),
});

// ─── LineItem schemas (one per tab) ───────────────────────────────────────────

export const palletLineItemSchema = z.object({
  shipmentType: z.literal("PALLET"),
  lineItem: z.object({
    type: z.literal("PALLET"),
    measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
    dangerousGood: z.boolean().optional(),
    stackable: z.boolean().optional(),
    quantity: z.number().default(1),
    units: z.array(
      z.object({
        length: z.coerce.number(" ").min(1),
        width: z.coerce.number(" ").min(1),
        height: z.coerce.number(" ").min(1),
        weight: z.coerce.number(" ").min(1),
        freightClass: z.string(" ").optional(),
        nmfc: z.string().nullable().optional(),
        // palletUnitType: z.string(" ").optional(),
        palletUnitType: z
          .enum([
            "PALLET",
            "DRUM",
            "BOXES",
            "ROLLS",
            "PIPES_OR_TUBES",
            "BALES",
            "BAGS",
            "CYLINDER",
            "PAILS",
            "REELS",
            "CRATE",
            "LOOSE",
            "PIECES",
          ])
          .nullable()
          .optional(),
        unitsOnPallet: z.coerce.number(" ").optional(),
        stackable: z.boolean().optional(),
        description: z.string().optional(),
      }),
    ),
  }),
});
// .superRefine((data, ctx) => {
//   const unit = data.lineItem.measurementUnit;

//   const maxWeight =
//     unit === "IMPERIAL" ? 5000 : 2268;

//   data.lineItem.units.forEach((u, index) => {
//     const weight = Number(u.weight);
//     // console.log("SUPER REFINE", weight, maxWeight);
//     if (weight > maxWeight) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["lineItem", "units", index, "weight"],
//         message:
//           unit === "IMPERIAL"
//             ? "Too heavy for standard quote (max 5000 lbs). Request spot quote."
//             : "Too heavy for standard quote (max 2268 kg). Request spot quote.",
//       });
//     }
//   });
// });

export const spotLtlLineItemSchema = z.object({
  shipmentType: z.literal("SPOT_LTL"),
  lineItem: z.object({
    type: z.literal("SPOT_LTL"),
    measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
    quantity: z.number().default(1),
    units: z.array(
      z.object({
        length: z.coerce.number(" ").min(1),
        width: z.coerce.number(" ").min(1),
        height: z.coerce.number(" ").min(1),
        weight: z.coerce.number(" ").min(1),
        freightClass: z.string(" ").optional(),
        nmfc: z.string().optional(),
        palletUnitType: z.string(" ").optional(),
        unitsOnPallet: z.coerce.number(" ").optional(),
        stackable: z.boolean().optional(),
        description: z.string().optional(),
      }),
    ),
  }),
});

export const packageLineItemSchema = z.object({
  shipmentType: z.literal("PACKAGE"),
  lineItem: z.object({
    type: z.literal("PACKAGE"),
    measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
    dangerousGood: z.boolean().optional(),
    units: z.array(packageUnitSchema).min(1, "Add at least one package"),
  }),
});

export const spotFtlLineItemSchema = z.object({
  shipmentType: z.literal("SPOT_FTL"),
  lineItem: z.object({
    type: z.literal("SPOT_FTL"),
    measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
    quantity: z.number().default(1),
    units: z.array(
      z.object({
        length: z.coerce.number(" ").min(1),
        width: z.coerce.number(" ").min(1),
        height: z.coerce.number(" ").min(1),
        weight: z.coerce.number(" ").min(1),
        unitsOnPallet: z.coerce.number(" ").optional(),
        description: z.string().optional(),
        palletUnitType: z.string(" ").optional(),
        stackable: z.boolean().optional(),
      }),
    ),
  }),
});

export const courierLineItemSchema = z.object({
  shipmentType: z.literal("COURIER_PAK"),
  lineItem: z.object({
    type: z.literal("COURIER_PAK"),
    measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
    units: z.array(courierUnitSchema).min(1, "Add at least one item"),
  }),
});

export const ftlLineItemSchema = z.object({
  shipmentType: z.literal("STANDARD_FTL"),
  lineItem: z.object({
    type: z.literal("STANDARD_FTL"),
    measurementUnit: z.enum(["METRIC", "IMPERIAL"]),
    units: z.array(ftlUnitSchema).min(1, "Add at least one item"),
  }),
});

// ─── Discriminated union — the single source of truth ─────────────────────────

export const lineItemSchema = z.discriminatedUnion("shipmentType", [
  palletLineItemSchema,
  packageLineItemSchema,
  courierLineItemSchema,
  ftlLineItemSchema,
]);

// ─── Master dimensions schema ──────────────────────────────────────────────────

export const dimensionsSchema = z.object({
  shipmentType: z.enum(["PALLET", "PACKAGE", "COURIER_PAK", "STANDARD_FTL"]),
  lineItem: lineItemSchema,
});

// ─── Inferred types (never write types manually again) ────────────────────────

export type PalletUnit = z.infer<typeof palletLineItemSchema>;
export type PackageUnit = z.infer<typeof packageUnitSchema>;
export type CourierUnit = z.infer<typeof courierUnitSchema>;
export type FTLUnit = z.infer<typeof ftlUnitSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type DimensionsValues = z.infer<typeof dimensionsSchema>;
export type spotLTLUnit = z.infer<typeof spotLtlLineItemSchema>;
export type spotFTLUnit = z.infer<typeof spotFtlLineItemSchema>;
