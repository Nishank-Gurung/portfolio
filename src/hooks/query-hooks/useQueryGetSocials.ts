import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetSocials() {
    return useQuery({
        queryKey: ['socials'],
        queryFn: async () => {
            return await APIRequest.get("/api/social")
        }
    })
}