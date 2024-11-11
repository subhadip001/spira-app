import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "../../_components/icons"
import { login } from "./action"
import { ArrowRight } from "lucide-react"

export default async function Login(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const formId = searchParams["formId"]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to continue with Spira</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login}>
            {formId && <input type="hidden" name="formId" value={formId} />}
            <Button type="submit" className="w-full flex items-center gap-2">
              <Icons.googleColored className="mr-2 h-4 w-4" />
              Continue with Google
              <div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
