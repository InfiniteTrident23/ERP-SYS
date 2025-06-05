"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import Link from "next/link"
import { PlusCircle, Trash2, Eye, Edit } from "lucide-react"
import { useFetchForms, useDeleteKpi } from "@/hooks/forms"
import { useState } from "react"
import { Badge } from "@workspace/ui/components/badge"

export default function FormsPage() {
  const { data: forms, isLoading, error } = useFetchForms()
  const deleteKpiMutation = useDeleteKpi()
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null)

  const handleDelete = (formId: string) => {
    const numericId = formId.startsWith("form-") ? formId.split("-")[1]! : formId
    setDeletingFormId(formId)
    deleteKpiMutation.mutate(numericId, {
      onSuccess: () => setDeletingFormId(null),
      onError: () => setDeletingFormId(null),
    })
  }

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your KPIs...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading KPIs: {error.message}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your KPIs</h1>
          <p className="text-gray-600 mt-2">Manage and edit your created KPIs</p>
        </div>
        <Link href="/qoc/builder/form/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New KPI
          </Button>
        </Link>
      </div>

      {!forms || forms.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PlusCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No KPIs found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first KPI</p>
          <Link href="/qoc/builder/form/create">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First KPI
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{form.title}</CardTitle>
                    <CardDescription>Created on {new Date(form.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant="secondary">{form.value}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {form.elements.length} {form.elements.length === 1 ? "Field" : "Fields"}
                  </p>
                  {form.description && (
                    <p className="text-sm text-gray-500 line-clamp-2" title={form.description}>
                      {form.description}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <Link href={`/qoc/builder/form/view/${form.id.replace("form-", "")}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/qoc/builder/form/edit/${form.id.replace("form-", "")}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingFormId === form.id}>
                      {deletingFormId === form.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete KPI</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{form.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(form.id)} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
