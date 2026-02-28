import { EducationForm } from "@/components/forms/EducationForm";
import APIRequest from "@/lib/BackendReq";
import { education } from "@/lib/types";
import axios from "axios";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    id: string
  }>
}
export default function page({searchParams}: PageProps) {
    return (
        <div>
            <EducationPage searchParams={searchParams} />
        </div>
    );
}

const EducationPage =async ({searchParams}: PageProps) => {
    const {id} = await searchParams

  if (!id) {
    return <EducationForm />
  }

  console.log(id)
  let education: education
    try {
        const res = await APIRequest.get(`/api/education/${id}`)
        if(res.data.success){
        education = res.data.education
        } else {
            console.error("Failed to fetch education data:", res.data)
            redirect(`/admin/education?error=${encodeURIComponent('Something went wrong')}`)
        }
    } catch (error) {
        console.error("Failed to fetch education data:", error)
        redirect(`/admin/education?error=${encodeURIComponent('Something went wrong')}`)
    }
    return (
        <div>
            <EducationForm education={education} />
        </div>
    );
};
