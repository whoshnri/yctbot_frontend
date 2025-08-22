"use client"

import AnalyticsPage from "./analytics/page";
interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  category: string;
}
export default function DashboardPage() {
  return(
    <>
    <AnalyticsPage/>
    </>
  )
}

