import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"

export function useQueryGetBlogs() {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            return await APIRequest.get("/api/blog")
        }
    })
}