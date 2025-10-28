"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, Send, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function EmailSupportDialog() {
  const [open, setOpen] = useState(false);
  const [userEmail] = useState("user@example.com");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!subject || !message) {
      toast({
        title: "Missing details",
        description: "Please fill both subject and message.",
        variant: "destructive",
      });
      return;
    }

    // ✅ TypeScript-safe toast with ReactNode using `as unknown as string`
    toast({
      title: (
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <span>Email sent successfully</span>
        </div>
      ) as unknown as string,
      description: (
        <div className="text-sm text-gray-600">
          <p>From: <strong>{userEmail}</strong></p>
          <p>To: <strong>marina@gmail.com</strong></p>
        </div>
      ) as unknown as string,
    });

    setSubject("");
    setMessage("");
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-primary-foreground font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Mail className="w-4 h-4" />
        Email Support
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden rounded-2xl shadow-xl border border-blue-100 bg-white">
          {/* Ocean-Themed Header */}
          <DialogHeader className="gradient-ocean px-6 py-5 text-white">
            <VisuallyHidden>
              <DialogTitle>New Message</DialogTitle>
            </VisuallyHidden>

            <div className="flex items-center justify-between">
              {/* Left: Mail icon + title */}
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold tracking-wide">
                  New Message
                </h2>
              </div>

              {/* Right: Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5 space-y-5 bg-gradient-to-b from-blue-50 to-white">
            <div>
              <Label className="text-sm font-medium text-slate-600">From</Label>
              <Input
                value={userEmail}
                disabled
                className="mt-1 bg-white/60 border border-blue-100 rounded-md text-sm text-gray-800 shadow-sm focus-visible:ring-1 focus-visible:ring-sky-400"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-600">To</Label>
              <Input
                value="marina@gmail.com"
                disabled
                className="mt-1 bg-white/60 border border-blue-100 rounded-md text-sm text-gray-800 shadow-sm focus-visible:ring-1 focus-visible:ring-sky-400"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-600">
                Subject
              </Label>
              <Input
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 bg-white border border-blue-100 rounded-md text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-sky-400"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-600 mb-1">
                Message
              </Label>
              <Textarea
                placeholder="Write your message..."
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 bg-white border border-blue-100 rounded-md text-sm p-3 shadow-sm focus-visible:ring-1 focus-visible:ring-sky-400 min-h-[220px] resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gradient-to-r from-sky-50 to-blue-50 flex justify-end">
            <Button
              onClick={handleSend}
              className="gradient-ocean hover:to-sky-500 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
