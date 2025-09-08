import Link from 'next/link'
import { appRoutes } from '@/shared/config'

const Home = () => {
  return (
    <div className='flex flex-col gap-3'>
      <h1>Home Page</h1>
      <Link href={appRoutes.workspace.index}>Workspace</Link>
      <Link href={appRoutes.admin.index}>Admin</Link>
    </div>
  )
}

export default Home
