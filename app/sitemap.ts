import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://biye-profile.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all public biodatas
  const publicProfiles = await prisma.biodata.findMany({
    where: { isPublic: true },
    select: {
      user: {
        select: { username: true }
      },
      updatedAt: true
    }
  })

  const biodataRoutes: MetadataRoute.Sitemap = publicProfiles.map((profile) => ({
    url: `${BASE_URL}/biodata/${profile.user.username}`,
    lastModified: profile.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [...staticRoutes, ...biodataRoutes]
}
