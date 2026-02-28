import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";

export default function Page() {
return (
    <>
       <main>
         <HeroSection />
        {/* <AboutSection /> */}
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        {/* <BlogSection /> */}
        <ContactSection />
        </main> 
    </>
);
}