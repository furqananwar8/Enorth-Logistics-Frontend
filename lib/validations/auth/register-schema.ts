import { z } from "zod"

const palletVolumeEnum = z.enum(["1-5", "6-10", "11-20", "21-50", "> 50"])
const packageVolumeEnum = z.enum(["< 25", "26-50", "50-100", "101-300", "> 300"])

export const registerSchema = z.object({
  user: z.object({
    email: z.email("Invalid email address"),
    password: z.string()
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must include at least one special character")
      .min(8, "Password must be atleast 8 characters"),  // password should have 
    confirmPassword: z.string()
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must include at least one special character")
      .min(8, "Password must be atleast 8 characters"),
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    // username: z.string().nonempty("Username required"),
    signUpCode: z.string().optional(),
    termsAndConditionAccepted: z
      .boolean("You must accept the Terms and Conditions"),
    companyPolicyAccepted: z
      .boolean("You must accept the Company Policy"),
    freightBroker: z.boolean(),
    phoneNumber: z.string().min(1, "Phone number required").max(15, "Phone number must be at most 15 characters")
  }).refine((user) => user.password === user.confirmPassword, {
    message: "Passwords do not match",
    path: ["user", "confirmPassword"]
  }),

  company: z.object({
    name: z.string().min(1, "Company name required"),
    industryType: z.string().optional()
  }),

  address: z.object({
    address1: z.string().nonempty("Address is required"),
    address2: z.string().optional(),
    city: z.string().nonempty("City is required"),
    unit: z.string().optional(),
    state: z.string().nonempty("State is required"),
    country: z.string().nonempty("Country is required"),
    postalCode: z.string().min(5, "Postal code must be at least 5 characters").max(10, "Postal code must be at most 10 characters").nonempty("Postal code is required")
  }),

  shippingPreference: z
    .array(
      z.discriminatedUnion("shippingType", [
        z.object({
          shippingType: z.literal("pallet"),
          shippingVolume: palletVolumeEnum.optional()
        }),
        z.object({
          shippingType: z.literal("package"),
          shippingVolume: packageVolumeEnum.optional()
        }),
        z.object({
          shippingType: z.literal("PTL/FTL")
        })
      ])
    )
    .min(1, "Select at least one shipping preference")
})

export type RegisterSchemaTypes = z.infer<typeof registerSchema>