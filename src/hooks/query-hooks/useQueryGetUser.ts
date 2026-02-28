import APIRequest from "@/lib/BackendReq"
import { useQuery } from "@tanstack/react-query"


export const useQueryGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return await APIRequest.get("/api/user")
        }
    })
}