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

export const dangerousGoodsSchema = z.object({
  type: z.string().nonempty("Type is required"),
  un: z.string().nonempty("UN is required"),
  packagingGroup: z.string().nonempty("Packaging group is required"),
  class: z.string().nonempty("Class is required"),
  technicalName: z.string().nonempty("Technical Name is required"),
  emergencyContactName: z.string().nonempty("Emergency contact name is required"),
  emergencyContactPhone: z.string().nonempty("Emergency contact phone number is required"),
});

export const ltlEquipmentSelectorSchema = z
  .object({
    spotEquipment: z.object({
      type: z.enum(
        ["dryVan", "refrigerated"],
        "Please select a equipment type",
      ),
      isKnownShipper: z.enum(["Yes", "No"]).optional(),
      protectFromFreeze: z.boolean().optional(),
      dangerousGoods: z.boolean().optional(),
      allPalletsStackable: z.boolean().optional(),
      somePalletsStackable: z.boolean().optional(),
      refrigerated: refrigeratedSchema.optional(),
    }),
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
      !data.spotEquipment.refrigerated?.type
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["refrigerated", "type"],
        message: "Please select a refrigerated service type",
      });
    }

    // In Bond validation
    if (data.services?.inBondCheckbox) {
      if (!data.inBound) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inBound"],
          message: "In Bond details are required",
        });
        return;
      }

      const result = inBondSchema.safeParse(data.inBound);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["inBound", ...issue.path],
            message: issue.message,
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
      type: z.enum(
        ["dryVan", "refrigerated", "flatbed", "ventilatedTrailer"],
        "Please select a equipment type",
      ),
      isKnownShipper: z.enum(["Yes", "No"]).optional(),
      protectFromFreeze: z.boolean().optional(),
      // dangerousGoods: z.boolean().optional(),
      allPalletsStackable: z.boolean().optional(),
      somePalletsStackable: z.boolean().optional(),
      refrigerated: refrigeratedSchema.optional(),
    }),
    inBound: inBondSchema.partial().optional(),
    allPalletStackable: z.boolean().optional(),
    somePalletStackable: z.boolean().optional(),
    dangerousGoodsCheckbox: z.boolean().optional(),
    services: z.object({
      dangerousGoods: dangerousGoodsSchema.optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.dangerousGoodsCheckbox) {
      if (!data.services?.dangerousGoods) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["services", "dangerousGoods"],
          message: "Dangerous goods details are required",
        });
        return;
      }

      const result = dangerousGoodsSchema.safeParse(
        data.services?.dangerousGoods,
      );

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["services", "dangerousGoods", ...issue.path],
            message: issue.message,
          });
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
        "Please select an equipment type",
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
