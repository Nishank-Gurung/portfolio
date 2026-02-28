import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetSkills() {
    return useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            return await APIRequest.get("/api/skill")
        }
    })
}