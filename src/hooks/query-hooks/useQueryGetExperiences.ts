import { getAllWorks } from "@/data-access/work-data-access"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetExperiences() {
    return useQuery({
        queryKey: ['experiences'],
        queryFn: async () => {
            return await getAllWorks() 
                
        }
    })
}