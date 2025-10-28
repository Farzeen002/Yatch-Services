"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface Yacht {
  id: string
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
  const [filteredYachts, setFilteredYachts] = useState<Yacht[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const router = useRouter()

  const fetchYachts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("yachts").select("*")
      if (error) throw error
      if (data) {
        setYachts(data as Yacht[])
        setFilteredYachts(data as Yacht[])
      }
    } catch (error) {
      console.error("Error fetching yachts:", error)
      alert("Failed to fetch yachts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this yacht?")) return
    try {
      const { error } = await supabase.from("yachts").delete().eq("id", id)
      if (error) throw error
      setYachts(prev => prev.filter(y => y.id !== id))
      setFilteredYachts(prev => prev.filter(y => y.id !== id))
      alert("Yacht deleted successfully!")
    } catch (err: any) {
      console.error("Failed to delete yacht:", err)
      alert("Failed to delete yacht: " + err.message)
    }
  }

  // Handle search
  useEffect(() => {
    const lowerSearch = search.toLowerCase()
    const filtered = yachts.filter(
      yacht =>
        yacht.name.toLowerCase().includes(lowerSearch) ||
        yacht.type.toLowerCase().includes(lowerSearch) ||
        yacht.location.toLowerCase().includes(lowerSearch)
    )
    setFilteredYachts(filtered)
    setCurrentPage(1)
  }, [search, yachts])

  useEffect(() => {
    fetchYachts()
  }, [])

  if (isLoading) return <p>Loading yachts...</p>
  if (yachts.length === 0) return <p>No yachts added yet.</p>

  // Pagination
  const totalPages = Math.ceil(filteredYachts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentYachts = filteredYachts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900 text-center uppercase">YACHT DETAILS</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="mb-4 flex justify-start">
          <Input
            type="text"
            placeholder="Search yachts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 border"
          />
        </div>

        {/* Yacht Table */}
        <Table className="min-w-full border-collapse">
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead className="text-left text-white">Name</TableHead>
              <TableHead className="text-left text-white">Type</TableHead>
              <TableHead className="text-left text-white">Price</TableHead>
              <TableHead className="text-left text-white">Location</TableHead>
              <TableHead className="text-left text-white">Guests</TableHead>
              <TableHead className="text-left text-white">Length</TableHead>
              <TableHead className="text-left text-white">Rating</TableHead>
              <TableHead className="text-center text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentYachts.map(yacht => (
              <TableRow key={yacht.id} className="border-b border-gray-200 hover:bg-gray-50">
                <TableCell className="text-gray-800">{yacht.name}</TableCell>
                <TableCell className="text-gray-800">{yacht.type}</TableCell>
                <TableCell className="text-gray-800">${yacht.price}</TableCell>
                <TableCell className="text-gray-800">{yacht.location}</TableCell>
                <TableCell className="text-gray-800">{yacht.guests}</TableCell>
                <TableCell className="text-gray-800">{yacht.length} ft</TableCell>
                <TableCell className="text-gray-800">{yacht.rating.toFixed(1)} ({yacht.reviews})</TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push(`/admin/${yacht.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(yacht.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination and Items Per Page */}
        <div className="flex justify-between items-center mt-4">
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> 
            </Button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
               <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
