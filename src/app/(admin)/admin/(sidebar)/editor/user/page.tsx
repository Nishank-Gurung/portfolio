import { UserForm } from "@/components/forms/UserForm";
import APIRequest from "@/lib/BackendReq";
import { user } from "@/lib/types";
import axios from "axios";
import { redirect } from "next/navigation";


export default function page() {

  return (
    <div><UserContent /></div>
  )
}

const UserContent = async () => {
    let user: user
    try {
        const res = await APIRequest.get(`/api/user`)
        if(res.data.success){
            user = res.data.user
        } else {
            console.error("Failed to fetch user data:", res.data)
            redirect(`/admin/user?error=${encodeURIComponent('Something went wrong')}`)
        }
    } catch (error) {
        console.error("Failed to fetch user data:", error)
        redirect(`/admin/user?error=${encodeURIComponent('Something went wrong')}`)
    }

    return (
        <div><UserForm user={user} /></div>
    )
}