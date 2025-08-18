"use client"

import { cn } from "@/lib/utils"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock, Star, TrendingUp, AlertCircle } from "lucide-react"
import { mockInteractionTiming, mockReviews, mockUnanswered, mockBotSpeedLogs } from "@/lib/mock-data"

export default function DashboardPage() {
  // Calculate metrics from mock data
  const totalInteractions = mockInteractionTiming.length * 6172 // Scale up for demo
  const uniqueUsers = Math.floor(totalInteractions * 0.46) // ~46% unique users
  const avgSessionTime = Math.floor(
    mockInteractionTiming.reduce((acc, curr) => acc + curr.time_value, 0) / mockInteractionTiming.length,
  )
  const avgRating = mockReviews.reduce((acc, curr) => acc + curr.rating, 0) / mockReviews.length
  const avgResponseTime = Math.floor(
    mockBotSpeedLogs.reduce((acc, curr) => acc + curr.time_value, 0) / mockBotSpeedLogs.length,
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor your chatbot's performance and user interactions.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInteractions.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% vs last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(avgSessionTime / 1000)}m {Math.floor((avgSessionTime % 1000) / 16.67)}s
              </div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -5% vs last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)} ★</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.2 vs last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Response Time</span>
                <Badge variant="secondary">{avgResponseTime}ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Text Responses</span>
                <Badge variant="outline">Fast</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">JSON Responses</span>
                <Badge variant="outline">Moderate</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Training Needed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Unanswered Questions</span>
                <Badge variant="destructive">{mockUnanswered.length}</Badge>
              </div>
              <div className="space-y-2">
                {mockUnanswered.slice(0, 2).map((item) => (
                  <div key={item.id} className="text-sm text-muted-foreground truncate">
                    "{item.question}"
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent User Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(review.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
