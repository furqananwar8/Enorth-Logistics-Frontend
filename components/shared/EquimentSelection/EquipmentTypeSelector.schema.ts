import { z } from "zod";

const inBondSchema = z.object({
  bondType: z.string().min(1, "Bond type is required"),
  bondCancler: z.string().min(1, "Bond canceller is required"),
  contactKey: z.string().min(1, "Contact type is required"),
  contactValue: z.string().min(1, "Contact value is required"),
  address: z.string().min(1, "Address is required"),
});

const refrigeratedSchema = z.object({
  type: z.enum(["FRESH", "FROZEN"], {
    message: "Please select a refrigerated service type",
  }),
});

const limitedAccessSchema = z.object({
  limitedAccess: z.string().min(1, "Please select a location"),
  limitedAccessDescription: z.string().optional(),
});

export const ltlEquipmentSelectorSchema = z
  .object({
    spotEquipment: z.object({
    type:z.enum(["dryVan", "refrigerated"], "Please select a equipment type"),
      isKnownShipper: z.enum(["Yes", "No"]).optional(),
      protectFromFreeze: z.boolean().optional(),
      dangerousGoods: z.boolean().optional(),
      allPalletsStackable: z.boolean().optional(),
      somePalletsStackable: z.boolean().optional(),
    }),
    refrigerated: refrigeratedSchema.optional(),
    inBound: inBondSchema.partial().optional(),
    services: z.object({
      inBondCheckbox: z.boolean().optional(),
      limitedAccessCheckbox: z.boolean().optional(),
      limitedAccess: z.string().optional(),
      limitedAccessDescription: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Refrigerated validation
    if (
      (data as any).spotEquipment === "refrigerated" &&
      !data.refrigerated?.type
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["refrigerated", "type"],
        message: "Please select a refrigerated service type",
      });
    }

    // In Bond validation
    if (data.services?.inBondCheckbox) {
      const result = inBondSchema.safeParse(data.inBound);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ["services", "inBond", ...(issue.path || [])],
          });
        });
      }
    }

    // Limited Access validation
    if (data.services?.limitedAccessCheckbox) {
      if (!data.services?.limitedAccess) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["services", "limitedAccess"],
          message: "Please select a location",
        });
      }

      if (
        data.services.limitedAccess === "OTHER" &&
        !data.services.limitedAccessDescription
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["services", "limitedAccessDescription"],
          message: "Please specify the location",
        });
      }
    }
  });

export type ltlEquipmentSelectorFormValues = z.infer<
  typeof ltlEquipmentSelectorSchema
>;

export const ftlEquipmentSelectorSchema = z
  .object({
    spotEquipment: z.object({
    type:z.enum(["dryVan", "refrigerated", "flatbed", "ventilatedTrailer"], "Please select a equipment type"),
      isKnownShipper: z.enum(["Yes", "No"]).optional(),
      protectFromFreeze: z.boolean().optional(),
      dangerousGoods: z.boolean().optional(),
      allPalletsStackable: z.boolean().optional(),
      somePalletsStackable: z.boolean().optional(),
    }),
    refrigerated: refrigeratedSchema.optional(),
    inBound: inBondSchema.partial().optional(),
    services: z.object({
      inBondCheckbox: z.boolean().optional(),
      limitedAccessCheckbox: z.boolean().optional(),
      limitedAccess: z.string().optional(),
      limitedAccessDescription: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    // Refrigerated validation
    if (
      (data as any).spotEquipment === "refrigerated" &&
      !data.refrigerated?.type
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["refrigerated", "type"],
        message: "Please select a refrigerated service type",
      });
    }

    // In Bond validation
    if (data.services?.inBondCheckbox) {
      const result = inBondSchema.safeParse(data.inBound);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ["services", "inBond", ...(issue.path || [])],
          });
        });
      }
    }

    // Limited Access validation
    if (data.services?.limitedAccessCheckbox) {
      if (!data.services?.limitedAccess) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["services", "limitedAccess"],
          message: "Please select a location",
        });
      }

      if (
        data.services.limitedAccess === "OTHER" &&
        !data.services.limitedAccessDescription
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["services", "limitedAccessDescription"],
          message: "Please specify the location",
        });
      }
    }
  });

  export type ftlEquipmentSelectorFormValues = z.infer<
  typeof ftlEquipmentSelectorSchema
>;

export const timeCriticalEquipmentSelectorSchema = z
  .object({
    spotEquipment: z.object({
      type: z.enum(
        ["truck", "car", "van", "nextFlightOut"],
        "Please select an equipment type"
      ),
      isKnownShipper: z.enum(["Yes", "No"]).optional(),
    }),
  })
  .superRefine((data, ctx) => {
    const equipment = data.spotEquipment;

    if (equipment.type === "nextFlightOut") {
      if (!equipment.isKnownShipper) {
        ctx.addIssue({
          path: ["spotEquipment", "isKnownShipper"],
          code: z.ZodIssueCode.custom,
          message: "isKnownShipper is required for Next Flight Out shipments",
        });
      }
    }
  });

  export type timeCriticalEquipmentSelectorSchema = z.infer<
  typeof timeCriticalEquipmentSelectorSchema
>;