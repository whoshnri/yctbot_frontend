"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit } from "lucide-react"
import { mockQuestionsAndAnswers } from "@/lib/mock-data"

const categories = ["All", "Programming", "Databases", "General", "Admissions", "Courses"]

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredQuestions = mockQuestionsAndAnswers.filter((qa) => {
    const matchesSearch =
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || qa.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
            <p className="text-muted-foreground mt-2">Manage the chatbot's Q&A entries and categories.</p>
          </div>
          <Button className="bot-primary text-white hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add New Entry
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Q&A entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bot-primary text-white" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Q&A Table */}
        <Card>
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                <div className="col-span-4">QUESTION</div>
                <div className="col-span-5">ANSWER</div>
                <div className="col-span-2">CATEGORY</div>
                <div className="col-span-1">ACTIONS</div>
              </div>

              {/* Table Rows */}
              {filteredQuestions.map((qa) => (
                <div
                  key={qa.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="md:col-span-4">
                    <div className="font-medium text-sm mb-1 md:mb-0">{qa.question}</div>
                    <div className="md:hidden text-xs text-muted-foreground">Question</div>
                  </div>
                  <div className="md:col-span-5">
                    <div className="text-sm text-muted-foreground line-clamp-2">{qa.answer}</div>
                    <div className="md:hidden text-xs text-muted-foreground mt-1">Answer</div>
                  </div>
                  <div className="md:col-span-2">
                    <Badge
                      variant="secondary"
                      className={
                        qa.category === "Programming"
                          ? "bg-blue-100 text-blue-800"
                          : qa.category === "Databases"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {qa.category}
                    </Badge>
                  </div>
                  <div className="md:col-span-1">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4" />
                      <span className="md:hidden ml-2">Edit</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing 1 to {filteredQuestions.length} of {filteredQuestions.length} results
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
