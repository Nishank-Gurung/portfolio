import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            return await APIRequest.get("/api/project")
        }
    })
}