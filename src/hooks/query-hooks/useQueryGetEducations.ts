import { getAllEducation } from "@/data-access/education-data-access"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetEducations() {
    return useQuery({
        queryKey: ['educations'],
        queryFn: async () => {
            return await getAllEducation() 
        }
    })
}