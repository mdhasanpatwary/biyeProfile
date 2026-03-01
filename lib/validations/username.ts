import { z } from "zod"

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-z0-9]+$/, "Username must contain only lowercase letters and numbers (no spaces or special characters)")
