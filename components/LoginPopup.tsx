"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()

  const handleLogin = () => {
    onClose()
    router.push("/login")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm absolute top-32 left-100 transform-none bg-white shadow-lg border rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Login Required</DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 mb-6 text-sm">
          You need to log in to access this feature.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
