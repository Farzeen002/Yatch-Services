"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import YachtForm from "@/components/admin/yacht-form"
import Navigation from "@/components/navigation" // import your top nav

export default function EditYachtPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchYacht = async () => {
      try {
        const { data, error } = await supabase
          .from("yachts")
          .select("*")
          .eq("id", id)
          .single()
        if (error) throw error
        setInitialData(data)
      } catch (err) {
        console.error(err)
        alert("Failed to fetch yacht")
      } finally {
        setLoading(false)
      }
    }
    fetchYacht()
  }, [id])

  // if (loading) return <p>Loading...</p>
  // if (!initialData) return <p>Yacht not found</p>

  return (
    <div className="min-h-screen bg-background">
      <Navigation /> {/* Top navigation added */}
      <main className="max-w-7xl mx-auto py-10 px-4">
        <YachtForm
          initialData={initialData} 
          onSuccess={() => router.push("/admin")}
          onCancel={() => router.push("/admin")}
        />
      </main>
    </div>
  )
}
