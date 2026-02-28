import ProjectsPage from "@/components/admin/ProjectsPage";

interface Props {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}
export default async function page({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const error = resolvedParams.error as string;
    return (
        <div>
            <ProjectsPage error={error} />
        </div>
    );
}
