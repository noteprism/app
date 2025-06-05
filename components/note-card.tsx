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
  const [checkedStates, setCheckedStates] = useState<boolean[]>(note.checkedStates ?? [])
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

  // Handle checkbox toggle and persist to backend
  const handleCheckboxChange = async (idx: number) => {
    const newCheckedStates = [...checkedStates]
    newCheckedStates[idx] = !newCheckedStates[idx]
    setCheckedStates(newCheckedStates)
    await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ id: note.id, checkedStates: newCheckedStates }]),
    })
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
                    checked={!!checkedStates[idx]}
                    onChange={() => handleCheckboxChange(idx)}
                    className={getAccentColor()}
                  />
                  <span className={checkedStates[idx] ? "line-through text-muted-foreground" : undefined}>{match[1]}</span>
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

  // Utility to get high-contrast text color for note
  const getTextColor = () => {
    if (note.color.includes('yellow')) return 'text-yellow-900';
    if (note.color.includes('blue')) return 'text-blue-900';
    if (note.color.includes('green')) return 'text-green-900';
    if (note.color.includes('red')) return 'text-red-900';
    if (note.color.includes('purple')) return 'text-purple-900';
    return 'text-primary-foreground';
  }

  // Utility to get less-contrast (muted) text color for note
  const getMutedTextColor = () => {
    if (note.color.includes('yellow')) return 'text-yellow-700';
    if (note.color.includes('blue')) return 'text-blue-700';
    if (note.color.includes('green')) return 'text-green-700';
    if (note.color.includes('red')) return 'text-red-700';
    if (note.color.includes('purple')) return 'text-purple-700';
    return 'text-muted-foreground';
  }

  // Utility to get border color for note
  const getBorderColor = () => {
    if (note.color.includes('yellow')) return 'border-yellow-500';
    if (note.color.includes('blue')) return 'border-blue-500';
    if (note.color.includes('green')) return 'border-green-500';
    if (note.color.includes('red')) return 'border-red-500';
    if (note.color.includes('purple')) return 'border-purple-500';
    return 'border-border';
  }

  // Utility to get divider color for note
  const getDividerColor = () => {
    if (note.color.includes('yellow')) return 'border-yellow-300';
    if (note.color.includes('blue')) return 'border-blue-300';
    if (note.color.includes('green')) return 'border-green-300';
    if (note.color.includes('red')) return 'border-red-300';
    if (note.color.includes('purple')) return 'border-purple-300';
    return 'border-muted';
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  return (
    <Card
      className={cn(
        'shadow-sm transition-all',
        note.color,
        getBorderColor(),
        isEditing ? 'ring-2 ring-primary' : 'hover:shadow'
      )}
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
                {/* Render content with color classes */}
                {(() => {
                  const lines = note.content.split('\n')
                  return (
                    <>
                      <h3 className={cn('font-medium', getTextColor())}>{lines[0]}</h3>
                      <div className="mt-2 text-sm space-y-1">
                        {lines.slice(1).map((line, idx) => {
                          const match = line.match(/^\s*- (.+)$/)
                          if (match) {
                            return (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={!!checkedStates[idx]}
                                  onChange={() => handleCheckboxChange(idx)}
                                  className={getAccentColor()}
                                />
                                <span className={cn(checkedStates[idx] ? 'line-through' : undefined, getMutedTextColor())}>{match[1]}</span>
                              </div>
                            )
                          } else {
                            return <div key={idx} className={getMutedTextColor()}>{line}</div>
                          }
                        })}
                      </div>
                    </>
                  )
                })()}
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
          <CardFooter className={cn('px-3 py-1.5 text-xs border-t', getDividerColor(), getMutedTextColor())}>{formattedDate}</CardFooter>
        </>
      )}
    </Card>
  )
}
