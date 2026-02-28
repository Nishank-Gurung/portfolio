import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetExperiences() {
    return useQuery({
        queryKey: ['experiences'],
        queryFn: async () => {
            return await APIRequest.get("/api/work")
                
        }
    })
}