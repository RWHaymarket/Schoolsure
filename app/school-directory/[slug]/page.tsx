import { redirect } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default function SchoolDirectoryRedirect({ params }: PageProps) {
  redirect(`/school/${params.slug}`);
}
