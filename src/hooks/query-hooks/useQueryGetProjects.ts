import { getAllProjects } from "@/data-access/project-data-access"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            return await getAllProjects() 
        }
    })
}