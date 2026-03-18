import { EducationForm } from "@/components/forms/EducationForm";
import { getEducationById } from "@/data-access/education-data-access";
import { Education } from "@/generated/prisma/client";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    id: string;
  }>;
}
export default function page({ searchParams }: PageProps) {
  return (
    <div>
      <EducationPage searchParams={searchParams} />
    </div>
  );
}

const EducationPage = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams;

  console.log(id);
  let education: Education | null = null;

  if (id) {
    education = await getEducationById(Number(id));
    if (!education) {
      notFound();
    }
  }

  return (
    <div>
      <EducationForm education={education} />
    </div>
  );
};
