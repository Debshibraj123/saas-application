import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
   <div>
    Landing Page
      <div>
        <Link href="/sign-in">
        <Button>
           Login
        </Button>
        </Link>

        <Link href="/sign-up">
        <Button>
           Signup
        </Button>
        </Link>
      </div>
   </div>
  )
}
