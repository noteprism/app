"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Edit, Check } from "lucide-react"
import React from "react"

import type { Note } from "@/types/notes"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface NoteCardProps {
  note: Note
  onDelete: () => void
  onUpdate: (updated: { content: string; color?: string }) => void
  isEditing?: boolean
  cardStyle?: "outline" | "filled"
}

export const colorOptions = [
  { value: "bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-100", label: "Yellow", swatch: "bg-yellow-400", glass: "glass-yellow" },
  { value: "bg-gradient-to-br from-blue-200 via-blue-100 to-purple-100", label: "Blue", swatch: "bg-blue-400", glass: "glass-blue" },
  { value: "bg-gradient-to-br from-green-200 via-green-100 to-teal-100", label: "Green", swatch: "bg-green-400", glass: "glass-green" },
  { value: "bg-gradient-to-br from-red-200 via-red-100 to-yellow-100", label: "Red", swatch: "bg-red-400", glass: "glass-red" },
  { value: "bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100", label: "Purple", swatch: "bg-purple-400", glass: "glass-purple" },
]

export default function NoteCard({ note, onDelete, onUpdate, isEditing: isEditingProp, cardStyle = "outline" }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(!!isEditingProp)
  const [content, setContent] = useState(note.content)
  const [checkedStates, setCheckedStates] = useState<boolean[]>(note.checkedStates ?? [])
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

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

    // Get the clicked element and its text content
    const clickedElement = e.target as HTMLElement
    const clickedText = clickedElement.textContent || ''
    
    // Get click position relative to the element
    const rect = clickedElement.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    
    // Estimate the character position based on average character width
    // Using a monospace-like approximation
    const avgCharWidth = 8 // Approximate width in pixels per character
    const estimatedPosition = Math.round(relativeX / avgCharWidth)
    
    // Find the actual position in the full content
    let targetPosition = 0
    const lines = content.split('\n')
    let foundLine = false
    
    for (const line of lines) {
      if (line.includes(clickedText.trim())) {
        foundLine = true
        targetPosition += Math.min(estimatedPosition, line.length)
        break
      }
      targetPosition += line.length + 1 // +1 for newline
    }
    
    // If we couldn't find the exact position, don't modify it
    if (!foundLine) {
      targetPosition = 0
    }

    setIsEditing(true)
    
    // Set cursor position after the textarea is focused
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(targetPosition, targetPosition)
      }
    }, 0)
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

  // Get the glass effect class for this note's color
  const getGlassEffect = () => {
    const colorOption = colorOptions.find(option => option.value === note.color)
    return colorOption?.glass || ""
  }

  // Utility to get text color for note
  const getTextColor = () => {
    return "text-white"
  }

  // Utility to get muted text color for note
  const getMutedTextColor = () => {
    return "text-gray-300"
  }

  // Utility to get border color for note
  const getBorderColor = () => {
    if (note.color === 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-100') return 'border-yellow-400';
    if (note.color === 'bg-gradient-to-br from-blue-200 via-blue-100 to-purple-100') return 'border-blue-400';
    if (note.color === 'bg-gradient-to-br from-green-200 via-green-100 to-teal-100') return 'border-green-400';
    if (note.color === 'bg-gradient-to-br from-red-200 via-red-100 to-yellow-100') return 'border-red-400';
    if (note.color === 'bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100') return 'border-purple-400';
    return 'border-border';
  }

  // Utility to get divider color for note
  const getDividerColor = () => {
    if (note.color === 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-100') return 'border-yellow-700/30';
    if (note.color === 'bg-gradient-to-br from-blue-200 via-blue-100 to-purple-100') return 'border-blue-700/30';
    if (note.color === 'bg-gradient-to-br from-green-200 via-green-100 to-teal-100') return 'border-green-700/30';
    if (note.color === 'bg-gradient-to-br from-red-200 via-red-100 to-yellow-100') return 'border-red-700/30';
    if (note.color === 'bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100') return 'border-purple-700/30';
    return 'border-muted';
  }

  // Map gradient to accent color for checkboxes
  const getAccentColor = () => {
    if (note.color === 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-100') return 'accent-yellow-400';
    if (note.color === 'bg-gradient-to-br from-blue-200 via-blue-100 to-purple-100') return 'accent-blue-400';
    if (note.color === 'bg-gradient-to-br from-green-200 via-green-100 to-teal-100') return 'accent-green-400';
    if (note.color === 'bg-gradient-to-br from-red-200 via-red-100 to-yellow-100') return 'accent-red-400';
    if (note.color === 'bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100') return 'accent-purple-400';
    return 'accent-primary';
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  // Utility to get glass class for a given color value
  function getGlassClassFor(colorValue: string) {
    const colorOption = colorOptions.find(option => option.value === colorValue)
    return colorOption?.glass || ""
  }

  // Focus textarea on mount if isEditing is true from prop
  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  return (
    <Card
      className={cn(
        'shadow-sm transition-all glass-card',
        isEditing ? 'bg-background' : getGlassEffect(),
        isEditing ? 'ring-2 ring-primary' : 'hover:shadow-lg',
        'relative'
      )}
      onClick={!isEditing ? handleCardClick : undefined}
    >
      {isEditing ? (
        <CardContent className="p-3">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleBlur();
              }
            }}
            className="min-h-[100px] bg-background border-0 px-1 resize-none"
            placeholder="Note content"
            autoFocus
            onClick={e => e.stopPropagation()}
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
                                <span className={cn(checkedStates[idx] ? 'line-through opacity-70' : undefined, getMutedTextColor())}>{match[1]}</span>
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
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-300 hover:text-white">
                    <MoreHorizontal className="h-3 w-3" strokeWidth={1.5} />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" strokeWidth={1.5} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className={cn('px-3 py-1.5 text-xs border-t', getDividerColor(), getMutedTextColor(), 'flex items-center justify-between')}> 
            <span>{formattedDate}</span>
            <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'w-5 h-5 rounded-full border border-white/30 flex items-center justify-center transition-shadow',
                    colorOptions.find(o => o.value === note.color)?.swatch || ""
                  )}
                  onClick={e => { e.stopPropagation(); setColorPickerOpen(true) }}
                  tabIndex={0}
                  aria-label="Change card color"
                />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-2 flex gap-2 bg-background shadow-lg rounded-xl border">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-shadow',
                      option.swatch,
                      note.color === option.value && 'ring-2 ring-white'
                    )}
                    onClick={e => {
                      e.stopPropagation();
                      setColorPickerOpen(false);
                      if (note.color !== option.value) {
                        onUpdate({ content, color: option.value })
                      }
                    }}
                    aria-label={`Set color ${option.label}`}
                    type="button"
                  >
                    {note.color === option.value && <Check className="h-4 w-4 text-white" strokeWidth={1.5} />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
