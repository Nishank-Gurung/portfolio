import ExperiencesPage from "@/components/admin/ExperiencesPage";

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}
export default async function page({ searchParams }: Props) {
const resolvedParams = await searchParams;
  const error = resolvedParams.error as string;
  return (
    <div>
        <ExperiencesPage error={error}/>
    </div>
  )
}
