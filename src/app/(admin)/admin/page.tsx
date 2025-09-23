import Image from 'next/image'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'


import {Metadata} from 'next'
export const metadata: Metadata = {
  title: ' Login',
}
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
         <>
           <AdminLoginPage/> 
         </> 
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nishank Gurung. All rights reserved.
      </p>
    </div>
  )
}
