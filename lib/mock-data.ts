export interface QuestionAnswer {
  id: number
  question: string
  answer: string
  category: string
}

export interface InteractionTiming {
  id: number
  ip: string
  time_value: number
  date: string
}

export interface BotSpeedLog {
  id: number
  time_value: number
  res_type: string
}

export interface Review {
  id: number
  rating: number
  comment: string
  date: string
}

export interface Unanswered {
  id: number
  question: string
}

export const mockQuestionsAndAnswers: QuestionAnswer[] = [
  {
    id: 1,
    question: "What is Flask?",
    answer: "Flask is a lightweight Python web framework.",
    category: "Programming",
  },
  {
    id: 2,
    question: "What is SQLAlchemy?",
    answer: "SQLAlchemy is an ORM for Python to interact with databases.",
    category: "Databases",
  },
]

export const mockInteractionTiming: InteractionTiming[] = [
  {
    id: 1,
    ip: "192.168.1.101",
    time_value: 3542,
    date: "2025-08-16T10:45:00Z",
  },
  {
    id: 2,
    ip: "192.168.1.102",
    time_value: 1289,
    date: "2025-08-16T11:10:00Z",
  },
]

export const mockBotSpeedLogs: BotSpeedLog[] = [
  {
    id: 1,
    time_value: 210,
    res_type: "text",
  },
  {
    id: 2,
    time_value: 512,
    res_type: "json",
  },
]

export const mockReviews: Review[] = [
  {
    id: 1,
    rating: 4.5,
    comment: "Great experience, very fast responses!",
    date: "2025-08-15T14:32:00Z",
  },
  {
    id: 2,
    rating: 3.0,
    comment: "Answers were helpful but a bit slow.",
    date: "2025-08-16T09:12:00Z",
  },
]

export const mockUnanswered: Unanswered[] = [
  {
    id: 1,
    question: "How do I deploy a Flask app to production?",
  },
  {
    id: 2,
    question: "What is the difference between SQL and NoSQL?",
  },
]
