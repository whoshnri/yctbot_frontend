"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Clock, TrendingUp, Star } from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Generate sample data for charts
interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  category: string;
}
interface QTD {
  type: string;
  value: number;
  color: string;
}
interface OverViewDataType {
  total: number;
  count: number;
  avg: number;
}

interface InteractionDataType {
  day: number;
  interactions: number;
}

export default function AnalyticsPage() {
  const totalInteractions = 12345;
  const uniqueUsers = 5678;
  const avgSessionTime = "3m 20s";
  const avgRating = 4.5;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [count, setCount] = useState<number>(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [questionTypeData, setQuestionTypeData] = useState<QTD[]>([]);
  const [interactionData, setInteractionData] = useState<InteractionDataType[]>(
    []
  );
  const [overview, setOverview] = useState<OverViewDataType>({
    total: 0,
    count: 0,
    avg: 0.0,
  });

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch(`${API_URL}/get-interaction-data`);
        const json = await res.json();
        const rawData = json.data as {
          id: number;
          session_id: string;
          duration: number;
          date: string;
        }[];
        console.log(rawData);

        // Group interactions by day
        const grouped = rawData.reduce((map, item) => {
          const day = new Date(item.date).getDate();
          if (!map[day]) map[day] = 0;
          map[day] += 1;
          return map;
        }, {} as Record<number, number>);

        const interactionData: InteractionDataType[] = Array.from(
          { length: 30 },
          (_, i) => {
            const day = i + 1;
            return {
              day,
              interactions: grouped[day] ?? 0,
            };
          }
        );

        const sum = rawData.reduce((sum, item) => sum + item.duration, 0);
        const total = rawData.length;
        const uniqueIds = new Set(rawData.map((item) => item.session_id));
        const count = uniqueIds.size;
        const avg = count > 0 ? sum / count : 0;

        setInteractionData(interactionData);
        setOverview({ total, count, avg });

        console.log(interactionData, { total, count, avg });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/fetch-database`);
        const json = await res.json();
        const data: QuestionAnswer[] = json.data;

        setCount(data.length);
        const colors = [
          "#FF6B6B", // red
          "#4ECDC4", // teal
          "#45B7D1", // blue
          "#FFA36C", // orange
          "#6A4C93", // purple
          "#FFD93D", // yellow
          "#38B000", // green
        ];

        const categoryMap = data.reduce((map, q) => {
          const category = q.category ?? "Uncategorized";
          if (!map.has(category)) {
            map.set(category, { type: category, value: 0 });
          }
          map.get(category)!.value += 1;
          return map;
        }, new Map<string, { type: string; value: number }>());

        // Convert to array
        let categorySummary = Array.from(categoryMap.values());
        categorySummary.sort((a, b) => b.value - a.value);
        const top4 = categorySummary.slice(0, 4);
        if (categorySummary.length > 4) {
          const othersCount = categorySummary
            .slice(4)
            .reduce((sum, item) => sum + item.value, 0);
          top4.push({ type: "Others", value: othersCount });
        }

        // Assign random colors
        const withColors = top4.map((entry, idx) => ({
          ...entry,
          color: colors[idx],
        }));

        setQuestionTypeData(withColors);
        console.log(withColors);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    const fetchReplySpeen = async () => {
      try {
        const res = await fetch(`${API_URL}/get-logs`);
        const response = await res.json();
        if (res.ok) {
          setAverageSpeed(Math.floor(response.average));
        } else {
          console.log("Failed to fetch, Bad response");
        }
      } catch (err) {
        console.log(`Error ${err}`);
      }
    };

    fetchInteractions();
    fetchReplySpeen()
    fetchData();
  }, []);

  // const satisfactionData = [
  //   { stars: 5, percentage: 75, count: 750 },
  //   { stars: 4, percentage: 15, count: 150 },
  //   { stars: 3, percentage: 5, count: 50 },
  //   { stars: 2, percentage: 3, count: 30 },
  //   { stars: 1, percentage: 2, count: 20 },
  // ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4caf50]">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Monitor chatbot performance and user interactions.
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <Badge variant="outline">Overview</Badge>
            <Badge variant="outline">Engagement</Badge>
            <Badge variant="outline">Satisfaction</Badge>
          </div> */}
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Interactions
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.total.toLocaleString()}
              </div>
              {/* <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.count.toLocaleString()}
              </div>
              {/* <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +10% vs last month
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Session Duration
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(overview.avg)} secs</div>
              {/* <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -5% vs last month
              </div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AVG Bot Reply Speed
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageSpeed} secs</div>
              {/* <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -5% vs last month
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Engagement Trends */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
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

          <Card className="col-span-1">
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
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground">
                        Questions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {questionTypeData.map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Satisfaction */}
        {/* <Card>
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
                  <div className="text-4xl font-bold text-yellow-500">
                    {avgRating} ★
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Based on user feedback
                    </p>
                    <p className="text-sm text-muted-foreground">
                      1,000 total ratings
                    </p>
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
                          backgroundColor:
                            item.stars >= 4
                              ? "#4CAF50"
                              : item.stars === 3
                              ? "#FFA726"
                              : "#F44336",
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
}
