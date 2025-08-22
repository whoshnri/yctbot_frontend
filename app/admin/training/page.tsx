"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react"

interface Unanswered {
  id: number
  question: string
  category: string
}

export default function TrainingPage() {
  const [unanswered, setUnanswered] = useState<Unanswered[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch unanswered questions from Flask
  useEffect(() => {
    const fetchUnanswered = async () => {
      try {
        const res = await fetch(`${API_URL}/get-unanswered`)
        const data = await res.json()
        setUnanswered(data.data)
      } catch (err) {
        console.error("Failed to load unanswered questions:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUnanswered()
  }, [])

  const handleSaveAnswer = async (q: Unanswered) => {
    const answer = answers[q.id]
    if (!answer || !answer.trim()) return alert("Please provide an answer.")

    setSavingId(q.id)
    try {
      const res = await fetch(`${API_URL}/edit_unanswered`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: q.id,
          question: q.question,
          answer,
          category: q.category,
        }),
      })
      const data = await res.json()

      if (data.status === 1) {
        setUnanswered((prev) => prev.filter((item) => item.id !== q.id))
        setAnswers((prev) => {
          const copy = { ...prev }
          delete copy[q.id]
          return copy
        })
      } else {
        alert(data.message || "Something went wrong")
      }
    } catch (err) {
      console.error("Failed to save answer:", err)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#4caf50]">Training</h1>
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
              <div className="text-2xl font-bold">{unanswered.length}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
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
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : unanswered.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  There are no unanswered questions at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {unanswered.map((q) => (
                  <div key={q.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive" className="text-xs">
                            Unanswered
                          </Badge>
                          <span className="text-xs text-muted-foreground">Question #{q.id}</span>
                        </div>
                        <h3 className="font-medium text-lg mb-2">{q.question}</h3>
                        <p className="text-sm text-muted-foreground">
                          This question was asked by a user but couldn’t be answered by the current knowledge base.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Provide Answer:</label>
                      <Textarea
                        placeholder="Enter a comprehensive answer for this question..."
                        className="min-h-[100px]"
                        value={answers[q.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          className="bot-primary text-white hover:opacity-90"
                          onClick={() => handleSaveAnswer(q)}
                          disabled={savingId === q.id}
                        >
                          {savingId === q.id ? "Saving..." : "Save Answer"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setUnanswered((prev) => prev.filter((item) => item.id !== q.id))
                          }
                        >
                          Mark as Irrelevant
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
