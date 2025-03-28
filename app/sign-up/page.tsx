import { SignUpForm } from "@/components/sign-up-form"
import { OAuthButtons } from "@/components/oauth-buttons"

export default function SignUpPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Join Nirvasana to start your property search journey
          </p>
        </div>
        
        <SignUpForm />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <OAuthButtons />
      </div>
    </div>
  )
} 