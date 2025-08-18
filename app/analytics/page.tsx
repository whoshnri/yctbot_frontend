"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Clock, TrendingUp, Star } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Generate sample data for charts
const interactionData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  interactions: Math.floor(Math.random() * 500) + 200,
}))

const questionTypeData = [
  { name: "Admissions", value: 45, color: "#4CAF50" },
  { name: "Courses", value: 30, color: "#81C784" },
  { name: "Support", value: 15, color: "#A5D6A7" },
  { name: "Other", value: 10, color: "#C8E6C9" },
]

const satisfactionData = [
  { stars: 5, percentage: 75, count: 750 },
  { stars: 4, percentage: 15, count: 150 },
  { stars: 3, percentage: 5, count: 50 },
  { stars: 2, percentage: 3, count: 30 },
  { stars: 1, percentage: 2, count: 20 },
]

export default function AnalyticsPage() {
  const totalInteractions = 12345
  const uniqueUsers = 5678
  const avgSessionTime = "3m 20s"
  const avgRating = 4.5

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-2">Monitor chatbot performance and user interactions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Overview</Badge>
            <Badge variant="outline">Engagement</Badge>
            <Badge variant="outline">Satisfaction</Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInteractions.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
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
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +10% vs last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Session Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSessionTime}</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -5% vs last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Trends */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Interactions Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">Last 30 Days</p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  interactions: {
                    label: "Interactions",
                    color: "#4CAF50",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={interactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis dataKey="day" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="interactions"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      dot={{ fill: "#4CAF50", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Question Types</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <div className="relative">
                  <ResponsiveContainer width={250} height={250}>
                    <PieChart>
                      <Pie
                        data={questionTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {questionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1.2k</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {questionTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              User Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-yellow-500">{avgRating} ★</div>
                  <div>
                    <p className="text-sm text-muted-foreground">Based on user feedback</p>
                    <p className="text-sm text-muted-foreground">1,000 total ratings</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {satisfactionData.map((item) => (
                  <div key={item.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{item.stars}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.stars >= 4 ? "#4CAF50" : item.stars === 3 ? "#FFA726" : "#F44336",
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
