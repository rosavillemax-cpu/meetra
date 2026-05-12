import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://callroom.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { active: true },
      select: {
        slug: true,
        user: { select: { handle: true, createdAt: true } },
      },
      take: 1000,
    })

    const eventTypeRoutes: MetadataRoute.Sitemap = eventTypes.map(({ slug, user }) => ({
      url: `${baseUrl}/${user.handle}/${slug}`,
      lastModified: user.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...eventTypeRoutes]
  } catch {
    return staticRoutes
  }
}
