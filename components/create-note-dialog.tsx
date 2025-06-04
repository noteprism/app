"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState } from "react"
import { Check, X } from "lucide-react"

import type { Note, NoteGroup } from "@/types/notes"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: NoteGroup[]
  onCreateNote: (note: Omit<Note, "id" | "createdAt">, groupId: string) => void
}

const colorOptions = [
  { value: "bg-yellow-100", label: "Yellow" },
  { value: "bg-blue-100", label: "Blue" },
  { value: "bg-green-100", label: "Green" },
  { value: "bg-red-100", label: "Red" },
  { value: "bg-purple-100", label: "Purple" },
]

export default function CreateNoteDialog({ open, onOpenChange, groups, onCreateNote }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [groupId, setGroupId] = useState(groups[0]?.id || "")
  const [color, setColor] = useState("bg-yellow-100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !groupId) return

    onCreateNote(
      {
        title,
        content,
        color,
      },
      groupId,
    )

    // Reset form
    setTitle("")
    setContent("")
    setColor("bg-yellow-100")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note content"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select value={groupId} onValueChange={setGroupId} required>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-2">
                {colorOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                    <Label
                      htmlFor={option.value}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                        option.value,
                        color === option.value && "border-primary",
                      )}
                    >
                      {color === option.value && <Check className="h-4 w-4" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Check className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
