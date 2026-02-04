import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://hirrd-jobportal.vercel.app";

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const supabase = await createClient();
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id, updated_at, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (jobs) {
      const jobRoutes = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: new Date(job.updated_at || job.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
      return [...routes, ...jobRoutes];
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}
