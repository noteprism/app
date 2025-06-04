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
  onUpdate: (updated: { content: string }) => void
}

export default function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const [checked, setChecked] = useState<{ [key: number]: boolean }>({})
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-save on blur
  const handleBlur = () => {
    onUpdate({ content })
    setIsEditing(false)
  }

  // Click to edit (ignore checkboxes, drag handle, three dots)
  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('input[type="checkbox"]') ||
      (e.target as HTMLElement).closest('[data-drag-handle]') ||
      (e.target as HTMLElement).closest('[data-menu]')
    ) {
      return
    }
    setIsEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  // Render content: first line as heading, checklist lines as checkboxes, others as text
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    return (
      <>
        <h3 className="font-medium">{lines[0]}</h3>
        <div className="mt-2 text-sm space-y-1">
          {lines.slice(1).map((line, idx) => {
            const match = line.match(/^\s*- (.+)$/)
            if (match) {
              return (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!checked[idx]}
                    onChange={() => setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    className={getAccentColor()}
                  />
                  <span className={checked[idx] ? "line-through text-muted-foreground" : undefined}>{match[1]}</span>
                </div>
              )
            } else {
              return <div key={idx}>{line}</div>
            }
          })}
        </div>
      </>
    )
  }

  // Map gradient to accent color for checkboxes
  const getAccentColor = () => {
    if (note.color.includes('yellow')) return 'accent-yellow-400';
    if (note.color.includes('blue')) return 'accent-blue-400';
    if (note.color.includes('green')) return 'accent-green-400';
    if (note.color.includes('red')) return 'accent-red-400';
    if (note.color.includes('purple')) return 'accent-purple-400';
    return 'accent-primary';
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  return (
    <Card
      className={cn("shadow-sm transition-all", note.color, isEditing ? "ring-2 ring-primary" : "hover:shadow")}
      onClick={handleCardClick}
    >
      {isEditing ? (
        <CardContent className="p-3">
            <Textarea
            ref={textareaRef}
              value={content}
            onChange={e => setContent(e.target.value)}
            onBlur={handleBlur}
              className="min-h-[100px] bg-white/50 border-0 px-1 resize-none"
              placeholder="Note content"
            autoFocus
          />
        </CardContent>
      ) : (
        <>
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {renderContent(note.content)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-menu>
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
          </CardContent>
          <CardFooter className="px-3 py-1.5 text-xs text-muted-foreground border-t">{formattedDate}</CardFooter>
        </>
      )}
    </Card>
  )
}
