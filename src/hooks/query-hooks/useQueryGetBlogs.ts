import { getAllBlogs } from "@/data-access/blog-data-access"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetBlogs() {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            return await getAllBlogs() 
        }
    })
}