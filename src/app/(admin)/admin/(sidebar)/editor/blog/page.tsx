import { BlogForm } from '@/components/forms/BlogForm'
import APIRequest from '@/lib/BackendReq'
import { post } from '@/lib/types'
import axios from 'axios'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{
    id: string
  }>
}
export default function page({searchParams}: PageProps) {
  return (
    <div><BlogPage searchParams={searchParams} /></div>
  )
}

const BlogPage = async ({searchParams}: PageProps) => {
  const {id} = await searchParams

  if (!id) {
    return <div><BlogForm /></div>
  }

  let blog: post
    try {
        const res = await APIRequest.get(`/api/blog/${id}`)
        if(res.data.success){
        blog = res.data.blog
        } else {
            console.error("Failed to fetch blog data:", res.data)
            redirect(`/admin/blog?error=${encodeURIComponent('Something went wrong')}`)
        }
    } catch (error) {
        console.error("Failed to fetch blog data:", error)
        redirect(`/admin/blog?error=${encodeURIComponent('Something went wrong')}`)
    }
  return (
    <div>
        <BlogForm blogPost={blog} />
    </div>
  );
}