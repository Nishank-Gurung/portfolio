import { getAllSkills } from "@/data-access/skill-data-access"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetSkills() {
    return useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            return await getAllSkills() 
        }
    })
}