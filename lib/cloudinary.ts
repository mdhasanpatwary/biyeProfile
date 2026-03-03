/**
 * Cloudinary image delivery configuration
 */
export const CLOUDINARY_CONFIG = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhixbw6tv",
    full: "w_600,h_600,c_fill,g_face,q_auto,f_auto",
    thumb: "w_200,h_200,c_fill,g_face,q_auto,f_auto",
};

/**
 * Generates a transformed Cloudinary URL from a public_id
 */
export function getCloudinaryUrl(publicId: string, type: "full" | "thumb" = "full"): string {
    if (!publicId) return "";

    // If it's already a full URL (legacy data), return it as is
    if (publicId.startsWith("http")) return publicId;

    const transformation = type === "full" ? CLOUDINARY_CONFIG.full : CLOUDINARY_CONFIG.thumb;
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformation}/${publicId}`;
}
