import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return(

  <section className=" flex items-center justify-center">
 
 <SignUp fallbackRedirectUrl='/onboarding' signUpForceRedirectUrl='/onboarding' />

</section>

  ) 
}