import { getAllSocials } from "@/data-access/social-data-access"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetSocials() {
    return useQuery({
        queryKey: ['socials'],
        queryFn: async () => {
            return await getAllSocials() 
        }
    })
}