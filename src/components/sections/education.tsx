"use client";
import { SectionHeading } from "@/components/section-heading";
import { HtmlContent } from "@/components/html-content";
import { format } from "date-fns";
import { IconSchool } from "@tabler/icons-react";
import { useQueryGetEducations } from "@/hooks/query-hooks/useQueryGetEducations";
import { education } from "@/lib/types";

export function EducationSection() {

    const {data: educationData, isLoading} = useQueryGetEducations();

    if (isLoading || !educationData?.data?.education) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const education:education[] = educationData.data.education || [];
  return (
    <section id="education" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Education" />

        <div className="space-y-8">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="flex gap-4 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <IconSchool className="size-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {edu.institution}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <p className="mt-1 text-xs font-mono text-muted-foreground">
                  {format(edu.startDate, "yyyy")} {" \u2014 "}
                  {edu.endDate ? format(edu.endDate, "yyyy") : "Present"}
                </p>
                {edu.description && (
                  <div className="mt-3">
                    <HtmlContent html={edu.description} className="text-sm" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
