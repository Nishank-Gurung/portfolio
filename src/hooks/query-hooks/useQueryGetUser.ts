import { getUser } from "@/data-access/user-data-access"
import { useQuery } from "@tanstack/react-query"

export const useQueryGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return await getUser() 
        }
    })
}