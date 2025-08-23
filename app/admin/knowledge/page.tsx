"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function KnowledgePage() {
  const [data, setData] = useState<QuestionAnswer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingQA, setEditingQA] = useState<QuestionAnswer | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [editingPendingId, setEditingPendingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addQuestion, setAddQuestion] = useState("");
  const [addAnswer, setAddAnswer] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addStatus, setAddStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [addMessage, setAddMessage] = useState<string | null>(null);

  const [toasts, setToasts] = useState<{ id: string; text: string; retry?: () => void }[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const showToast = useCallback((text: string, retry?: () => void) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((t) => [...t, { id, text, retry }]);
    if (!retry) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/fetch-database`);
      const json = await res.json();
      const items: QuestionAnswer[] = json.data ?? [];
      setData(items);
      const cats = ["All", ...Array.from(new Set(items.map((q) => q.category ?? "")))];
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching data", err);
      showToast("Failed to load knowledge base");
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtering
  const filteredQuestions = data.filter((qa: QuestionAnswer) => {
    const q = qa.question ?? "";
    const a = qa.answer ?? "";
    const matchesSearch =
      q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || qa.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openEdit = (qa: QuestionAnswer) => {
    setEditingQA(qa);
    setEditQuestion(qa.question);
    setEditAnswer(qa.answer);
    setEditCategory(qa.category);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (retrying = false) => {
    if (!editingQA) return;
    const id = editingQA.id;
    setEditingPendingId(id);

    try {
      const res = await fetch(`${API_URL}/edit-qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          question: editQuestion,
          answer: editAnswer,
          category: editCategory,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.status === 1) {

        setData((prev) =>
          prev.map((q) => (q.id === id ? { ...q, question: editQuestion, answer: editAnswer, category: editCategory } : q))
        );

        // visual success: green for 3s
        setSuccessId(id);
        setTimeout(() => {
          setSuccessId((cur) => (cur === id ? null : cur));
        }, 3000);

        setEditingPendingId(null);
        setIsEditOpen(false);
        showToast("Saved successfully");
      } else {
        // failed
        setEditingPendingId(null);
        const message = json?.message ?? "Failed to save edit";
        showToast(message, () => handleSaveEdit(true));
        // keep modal open (user asked for pending->green->fail behavior)
      }
    } catch (err) {
      setEditingPendingId(null);
      showToast("Network error while saving — retry?", () => handleSaveEdit(true));
    }
  };

  const handleAddSubmit = async () => {
    if (!addQuestion.trim() || !addAnswer.trim()) {
      setAddMessage("Question and Answer are required");
      setAddStatus("error");
      return;
    }
    setAddStatus("pending");
    setAddMessage(null);

    try {
      const res = await fetch(`${API_URL}/add-qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: addQuestion,
          answer: addAnswer,
          category: addCategory,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.status === 1) {
        setAddStatus("success");
        setAddMessage("Entry added successfully.");
      } else {
        setAddStatus("error");
        setAddMessage(json?.message ?? "Failed to add entry — please try again");
      }
    } catch (err) {
      console.error(err);
      setAddStatus("error");
      setAddMessage("Network error — please try again");
    }
  };

  // Small helper for retrying a toast action
  const runRetry = (id: string) => {
    const t = toasts.find((x) => x.id === id);
    if (t?.retry) t.retry();
    setToasts((s) => s.filter((x) => x.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#4caf50]">Knowledge Base</h1>
            <p className="text-muted-foreground mt-2">Manage the chatbot's Q&A entries and categories.</p>
          </div>
          <Button
            className="bot-primary text-white hover:opacity-90"
            onClick={() => {
              setIsAddOpen(true);
              setAddStatus("idle");
              setAddMessage(null);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Entry
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search Q&A entries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>

                <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                       {cat || "Uncategorized"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="rounded-lg px-6 py-2"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  Reset
                </Button>
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
              {paginatedQuestions.map((qa) => {
                const isPending = editingPendingId === qa.id;
                const isSuccess = successId === qa.id;
                return (
                  <div
                    key={qa.id}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg transition-colors ${
                      isPending
                        ? "bg-blue-100 border border-blue-300" // pending blue
                        : isSuccess
                        ? "bg-green-100 border border-green-300" // success green for 3s
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="md:col-span-4">
                      <div className="font-medium text-sm mb-1 md:mb-0">{qa.question}</div>
                    </div>
                    <div className="md:col-span-5">
                      <div className="text-sm text-muted-foreground line-clamp-2">{qa.answer}</div>
                    </div>
                    <div className="md:col-span-2">
                      <Badge variant="secondary">{qa.category}</Badge>
                    </div>
                    <div className="md:col-span-1 flex items-start">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openEdit(qa)}
                        disabled={isPending}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="md:hidden ml-2">Edit</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredQuestions.length)} of {filteredQuestions.length} results
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Q&A Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
            </div>
            <div>
              <Label>Answer</Label>
              <Input value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bot-primary text-white"
              onClick={() => handleSaveEdit()}
              disabled={editingPendingId === editingQA?.id}
            >
              {editingPendingId === editingQA?.id ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Q&A</DialogTitle>
          </DialogHeader>

          {addStatus === "success" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-green-50 border border-green-200">
                <div className="font-medium">Success</div>
                <div className="text-sm text-muted-foreground">{addMessage}</div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Close
                </Button>
                <Button
                  className="bot-primary text-white"
                  onClick={() => {
                    // reload view to see changes
                    fetchData();
                    setIsAddOpen(false);
                  }}
                >
                  Reload the view changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input value={addQuestion} onChange={(e) => setAddQuestion(e.target.value)} />
              </div>
              <div>
                <Label>Answer</Label>
                <Input value={addAnswer} onChange={(e) => setAddAnswer(e.target.value)} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={addCategory} onChange={(e) => setAddCategory(e.target.value)} />
              </div>

              {addStatus === "error" && (
                <div className="p-2 rounded bg-red-50 border border-red-200 text-sm">
                  <div className="font-medium">Failed</div>
                  <div className="text-muted-foreground">{addMessage}</div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button className="bot-primary text-white" onClick={handleAddSubmit} disabled={addStatus === "pending"}>
                  {addStatus === "pending" ? "Adding..." : "Add Entry"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tiny Toasts (bottom-right) */}
      <div className="fixed right-4 bottom-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-red-50 border border-red-200 text-sm px-3 py-2 rounded shadow">
            <div className="flex items-center justify-between gap-4">
              <div>{t.text}</div>
              {t.retry ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => runRetry(t.id)}>
                    Retry
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
