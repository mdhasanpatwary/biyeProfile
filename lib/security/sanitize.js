function sanitizeString(value) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export function sanitizeDeep(input) {
  if (typeof input === "string") {
    return sanitizeString(input)
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeDeep(item))
  }

  if (input && typeof input === "object") {
    const entries = Object.entries(input).map(([key, value]) => [
      key,
      sanitizeDeep(value),
    ])

    return Object.fromEntries(entries)
  }

  return input
}
