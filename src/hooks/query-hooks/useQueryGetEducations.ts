import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetEducations() {
    return useQuery({
        queryKey: ['educations'],
        queryFn: async () => {
            return await APIRequest.get("/api/education")
        }
    })
}