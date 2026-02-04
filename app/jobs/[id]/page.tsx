import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import JobDetailsContent from "./JobDetailsContent";
import { notFound } from "next/navigation";

// Define the params type correctly for Next.js 15+ (if applicable) or standard Next.js 14
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getJob(id: string) {
  const supabase = await createClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*, companies(name, logo_url)")
    .eq("id", id)
    .single();

  if (error || !job) {
    return null;
  }

  return job;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  const companyName = job.companies?.name || "Unknown Company";

  return {
    title: `${job.title} at ${companyName} | Hirrd`,
    description: `Apply for the ${job.title} position at ${companyName} in ${job.location}. ${job.job_type} opportunity.`,
    openGraph: {
      title: `${job.title} at ${companyName}`,
      description: `We are hiring a ${job.title} in ${job.location}. Apply now on Hirrd!`,
      // images: [job.companies?.logo_url || '/og-image.png'], // If we had company logos
    },
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.companies?.name,
      value: job.id,
    },
    datePosted: job.created_at,
    validThrough:
      job.expires_at ||
      new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    employmentType: job.job_type.toUpperCase().replace(" ", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.companies?.name,
      logo: job.companies?.logo_url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN", // Assuming India based on IndianRupee icon usage, change if global
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.currency || "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: "YEAR", // Or MONTH, depending on data
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetailsContent job={job} />
    </>
  );
}
