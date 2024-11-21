"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Construction, Clock, ArrowRight } from "lucide-react"

export default function InProgressTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Construction className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">
            Coming Soon: Partial Submissions Tracking
          </CardTitle>
          <CardDescription className="text-base">
            We're building a powerful feature to help you track and manage
            partially completed form submissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3 bg-muted/50 rounded-lg p-4">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Save Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Users will be able to save their progress and return later to
                  complete the form
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-muted/50 rounded-lg p-4">
              <ArrowRight className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Resume Anytime</h4>
                <p className="text-sm text-muted-foreground">
                  Track incomplete submissions and send reminders to boost
                  completion rates
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="gap-2">
              <Clock className="w-4 h-4" />
              Get notified when it's ready
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
