import { LoginPage } from '@/screens/auth'

// Force dynamic rendering to avoid SSR issues with useQueryState
// export const dynamic = 'force-dynamic'

const Page = () => {
  return <LoginPage />
}

export default Page
