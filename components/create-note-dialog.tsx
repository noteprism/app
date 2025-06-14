"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"

import type { Note, NoteGroup } from "@/types/notes"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { colorOptions } from "@/components/note-card"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: NoteGroup[]
  onCreateNote: (note: Omit<Note, "id" | "createdAt">, groupId: string) => void
}

export default function CreateNoteDialog({ open, onOpenChange, groups, onCreateNote }: CreateNoteDialogProps) {
  const [content, setContent] = useState("")
  const [groupId, setGroupId] = useState("no-group")
  const [color, setColor] = useState(colorOptions[Math.floor(Math.random() * colorOptions.length)].value)

  useEffect(() => {
    if (open) {
      setColor(colorOptions[Math.floor(Math.random() * colorOptions.length)].value)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    onCreateNote(
      {
        content,
        color,
      },
      groupId,
    )
    setContent("")
    setColor(colorOptions[Math.floor(Math.random() * colorOptions.length)].value)
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note content"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select value={groupId} onValueChange={setGroupId} required>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="no-group" value="no-group">No Group</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
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
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-ring cursor-pointer transition-shadow hover:shadow-md",
                        option.swatch,
                        color === option.value && "ring-2 ring-white",
                      )}
                    >
                      {color === option.value && <Check className="h-5 w-5 text-white" strokeWidth={1.5} />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Cancel
            </Button>
            <Button type="submit">
              <Check className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Create Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
