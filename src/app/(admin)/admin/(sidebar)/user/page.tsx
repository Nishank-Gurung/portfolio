import UserPage from "@/components/admin/UserPage";

interface Props {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}
export default async function page({ searchParams }: Props) {
    const params = await searchParams;
    const error = params.error as string | undefined;
    return (
        <div>
            <UserPage error={error} />
        </div>
    );
}
