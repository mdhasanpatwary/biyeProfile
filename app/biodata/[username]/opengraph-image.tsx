import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { getCloudinaryUrl } from "@/lib/cloudinary"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: { biodata: true },
  })

  // Fallback for missing/private profiles
  if (!user || !user.biodata || !user.biodata.isPublic) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#0f0f0f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontSize: 64,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            BiyeProfile
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  const data = user.biodata.data as unknown as BiodataFormValues
  const name = data?.basicInfo?.fullName || username

  // Derive display attributes
  const religion = data?.basicInfo?.religion
  const occupation = data?.profession?.occupation
  const district = data?.personalInfo?.presentAddress

  // Build age string
  const age: string | null = (() => {
    if (!data?.basicInfo?.dateOfBirth) return null
    const birth = new Date(data.basicInfo.dateOfBirth)
    const today = new Date()
    let a = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
    return `${a} yrs`
  })()

  // Photo URL
  const photoUrl = data?.basicInfo?.photoUrl
    ? getCloudinaryUrl(data.basicInfo.photoUrl, "thumb")
    : null

  const tags = [religion, age, occupation, district].filter(Boolean) as string[]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0f0f0f",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "#ffffff",
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "80px 100px",
            gap: 80,
          }}
        >
          {/* Text section */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                fontSize: 13,
                color: "#666",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Marriage Biodata · BiyeProfile
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: name.length > 20 ? 60 : 72,
                color: "#ffffff",
                fontStyle: "italic",
                letterSpacing: "-2px",
                lineHeight: 1.1,
                marginBottom: 40,
              }}
            >
              {name}
            </div>

            {/* Tags row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "8px 20px",
                    border: "1px solid #333",
                    color: "#999",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          {photoUrl && (
            <div
              style={{
                width: 240,
                height: 300,
                flexShrink: 0,
                overflow: "hidden",
                border: "1px solid #222",
                display: "flex",
              }}
            >
              <img
                src={photoUrl}
                alt={name}
                width={240}
                height={300}
                style={{ objectFit: "cover", filter: "grayscale(100%)", width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>

        {/* Bottom brand strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "18px 100px",
            borderTop: "1px solid #1f1f1f",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#444",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            biyeprofile.com/biodata/{username}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#444",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            BiyeProfile Registry
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
