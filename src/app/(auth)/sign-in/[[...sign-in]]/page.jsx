import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return(
<section className=" flex items-center justify-center">
 
        <SignIn fallbackRedirectUrl='/onboarding' signUpForceRedirectUrl='/onboarding' />
    
</section>
  )
  
  
}