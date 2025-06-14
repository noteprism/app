"use client"

import { useState, useEffect } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import type { NoteGroup as NoteGroupType } from "@/types/notes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import NoteCard from "@/components/note-card"

interface NoteGroupProps {
  group: NoteGroupType
  onDeleteNote: (noteId: string, groupId: string) => void
  onUpdateGroup: (groupId: string, name: string) => void
  onDeleteGroup: (groupId: string) => void
  onUpdateNote: (noteId: string, groupId: string, updated: { content: string; color?: string }) => void
  cardStyle: "outline" | "filled"
}

export default function NoteGroup({ group, onDeleteNote, onUpdateGroup, onDeleteGroup, onUpdateNote, cardStyle }: NoteGroupProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(group.name || "")

  useEffect(() => {
    setName(group.name || "")
  }, [group.name])

  const handleSaveName = () => {
    onUpdateGroup(group.id, name)
    setIsEditing(false)
  }

  const handleNameBlur = () => {
    handleSaveName()
  }

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName()
    }
  }

  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-8"
              autoFocus
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
            />
          ) : (
            <CardTitle className="text-lg" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>{group.name}</CardTitle>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDeleteGroup(group.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={group.id} type="note">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[100px]">
              {group.notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.draggableProps} 
                      {...provided.dragHandleProps}
                    >
                      <NoteCard 
                        note={note} 
                        onDelete={() => onDeleteNote(note.id, group.id)} 
                        onUpdate={(updated) => {
                        onUpdateNote(note.id, group.id, updated);
                        }} 
                        cardStyle={cardStyle}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {group.notes.length === 0 && (
                <div className="flex items-center justify-center h-24 border border-dashed rounded-lg border-muted text-muted-foreground">
                  <p className="text-sm">Drag notes here</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
