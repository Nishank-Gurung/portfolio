import { BlogForm } from '@/components/forms/BlogForm'
import { getBlogById } from '@/data-access/blog-data-access'
import { Post } from '@/generated/prisma/client'
import { notFound } from 'next/navigation'

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

  

  let blog: Post | null = null
  if (id) {
    blog = await getBlogById(Number(id))
    if (!blog) {
      notFound();
    }
  }
  return (
    <div>
        <BlogForm blogPost={blog} />
    </div>
  );
}