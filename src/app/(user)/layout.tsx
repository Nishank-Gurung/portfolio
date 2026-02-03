import {Metadata} from 'next'

export const metadata: Metadata = {
  title: {
    template: 'Nishank Gurung | %s',
    default: 'Nishank Gurung',
  },
}

const UserLayout = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>
}
export default UserLayout
