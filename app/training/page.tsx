"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react"
import { mockUnanswered } from "@/lib/mock-data"

export default function TrainingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training</h1>
          <p className="text-muted-foreground mt-2">
            Review and respond to unanswered questions to improve the chatbot.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Questions</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUnanswered.length}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Questions answered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">Time to resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Unanswered Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Unanswered Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockUnanswered.map((question) => (
                <div key={question.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs">
                          Unanswered
                        </Badge>
                        <span className="text-xs text-muted-foreground">Question #{question.id}</span>
                      </div>
                      <h3 className="font-medium text-lg mb-2">{question.question}</h3>
                      <p className="text-sm text-muted-foreground">
                        This question was asked by a user but couldn't be answered by the current knowledge base.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Provide Answer:</label>
                    <Textarea
                      placeholder="Enter a comprehensive answer for this question..."
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button className="bot-primary text-white hover:opacity-90">Save Answer</Button>
                      <Button variant="outline">Mark as Irrelevant</Button>
                    </div>
                  </div>
                </div>
              ))}

              {mockUnanswered.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">There are no unanswered questions at the moment.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
