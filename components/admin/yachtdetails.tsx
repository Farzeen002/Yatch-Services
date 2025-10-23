"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Yacht {
  id: number
  name: string
  type: string
  price: number
  location: string
  guests: number
  length: number
  rating: number
  reviews: number
  images: string[]
  videos: string[]
}

interface YachtDetailsProps {
  onEdit?: (yacht: Yacht) => void
}

export default function YachtDetails({ onEdit }: YachtDetailsProps) {
  const supabase = createClient()
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchYachts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("yachts").select("*")
      if (error) throw error
      if (data) setYachts(data as Yacht[])
    } catch (error) {
      console.error("Error fetching yachts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this yacht?")) return
    try {
      const { error } = await supabase.from("yachts").delete().eq("id", id)
      if (error) throw error
      setYachts(prev => prev.filter(y => y.id !== id))
    } catch (error) {
      console.error("Failed to delete yacht:", error)
      alert("Failed to delete yacht. Please try again.")
    }
  }

  useEffect(() => {
    fetchYachts()
  }, [])

  if (isLoading) return <p>Loading yachts...</p>
  if (yachts.length === 0) return <p>No yachts added yet.</p>

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle>Yacht Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {yachts.map(yacht => (
              <TableRow key={yacht.id}>
                <TableCell>{yacht.name}</TableCell>
                <TableCell>{yacht.type}</TableCell>
                <TableCell>${yacht.price}</TableCell>
                <TableCell>{yacht.location}</TableCell>
                <TableCell>{yacht.guests}</TableCell>
                <TableCell>{yacht.length} ft</TableCell>
                <TableCell>{yacht.rating.toFixed(1)} ({yacht.reviews})</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(yacht)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(yacht.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
