"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import React from "react"

import type { Note } from "@/types/notes"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NoteCardProps {
  note: Note
  onDelete: () => void
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({})

  const handleSave = () => {
    // In a real app, we would update the note in the database
    setIsEditing(false)
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  const parseContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      const match = line.match(/^\s*- (.+)$/)
      if (match) {
        return (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!checked[idx]}
              onChange={() => setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }))}
              className="accent-green-500"
            />
            <span className={checked[idx] ? "line-through text-muted-foreground" : undefined}>{match[1]}</span>
          </div>
        )
      } else {
        return <div key={idx}>{line}</div>
      }
    })
  }

  return (
    <Card className={cn("shadow-sm transition-all", note.color, isEditing ? "ring-2 ring-primary" : "hover:shadow")}>
      {isEditing ? (
        <CardContent className="p-3">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-7 bg-white/50 border-0 px-1 font-medium"
              placeholder="Note title"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] bg-white/50 border-0 px-1 resize-none"
              placeholder="Note content"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{note.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2 whitespace-pre-line text-sm">
              {parseContent(note.content)}
            </div>
          </CardContent>
          <CardFooter className="px-3 py-1.5 text-xs text-muted-foreground border-t">{formattedDate}</CardFooter>
        </>
      )}
    </Card>
  )
}
