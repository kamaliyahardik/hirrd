import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        <CardDescription className="mt-2">
          We've sent a confirmation link to your email. Please check your inbox and click the link to verify your
          account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Once you verify your email, you'll be able to log in and complete your profile.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
