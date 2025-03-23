import { PUBLIC_BASE_URL } from "@/config"
import StatisticsService from "@/core/services/StatisticsService";
import { MetadataRoute } from "next"

 
export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }]
}
 
export default async function sitemap({
//   id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const data = await StatisticsService.getStatisticsInfo();
  const date = new Date().toISOString().split('T')[0];
  const maps = Object.values(data).map((d) => ({
    url: `https:${PUBLIC_BASE_URL}/map/${d.id}`,
    lastModified: date,
    priority: 0.8
  }))

  return [
    {
      url:  `https:${PUBLIC_BASE_URL}`,
      lastModified: date,
      priority: 1
    },
    {
      url:  `https:${PUBLIC_BASE_URL}/statistics/`,
      lastModified: date,
      priority: 0.9
    },
    {
      url:  `https:${PUBLIC_BASE_URL}/map/`,
      lastModified: date,
      priority: 0.8
    },
    ...maps,
  ]
}