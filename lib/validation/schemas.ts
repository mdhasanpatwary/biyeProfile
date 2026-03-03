import { z } from "zod"
import { biodataSchema } from "@/lib/validations/biodata"
import { usernameSchema } from "@/lib/validations/username"
import { USER_ROLES } from "@/lib/constants"

export { biodataSchema, usernameSchema }

export const biodataUpdatePayloadSchema = z.object({
  data: biodataSchema,
})

export const adminRoleSchema = z.enum(USER_ROLES)

export const adminPromoteSchema = z.object({
  email: z.string().email("Invalid email"),
  role: adminRoleSchema,
})
