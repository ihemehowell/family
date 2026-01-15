export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import RegisterClient from './registerclient'


export default function Page() {
  return (
    <Suspense fallback={null}>
     <RegisterClient />
    </Suspense>
  )
}