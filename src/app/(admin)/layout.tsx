import {Metadata} from 'next'

export const metadata: Metadata = {
  title: {
    template: 'Nishank Gurung Admin | %s',
    default: 'Nishank Gurung Admin',
  },
}

const AdminLayout = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>
}
export default AdminLayout
