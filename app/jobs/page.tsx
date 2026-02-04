import { Metadata } from "next";
import JobsList from "./JobsList";

export const metadata: Metadata = {
  title: "Browse Jobs | Hirrd",
  description:
    "Explore the latest job openings in tech, marketing, design, and more. Find your perfect role on Hirrd.",
  openGraph: {
    title: "Browse Jobs | Hirrd",
    description: "Search and apply for top jobs in your industry.",
  },
};

export default function JobsPage() {
  return <JobsList />;
}
