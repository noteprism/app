"use client"

import { useState } from "react"
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
  onUpdateGroup: (groupId: string, title: string) => void
  onDeleteGroup: (groupId: string) => void
  onUpdateNote: (noteId: string, groupId: string, updated: { title: string; content: string }) => void
}

export default function NoteGroup({ group, onDeleteNote, onUpdateGroup, onDeleteGroup, onUpdateNote }: NoteGroupProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(group.title)

  const handleSaveTitle = () => {
    onUpdateGroup(group.id, title)
    setIsEditing(false)
  }

  const handleTitleBlur = () => {
    handleSaveTitle()
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    }
  }

  return (
    <Card className="border-sidebar-border border shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="h-8"
              autoFocus
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
            />
          ) : (
            <CardTitle className="text-lg" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>{group.title}</CardTitle>
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
        <Droppable droppableId={group.id}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[100px]">
              {group.notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <NoteCard note={note} onDelete={() => onDeleteNote(note.id, group.id)} onUpdate={(updated) => {
                        const title = updated.content.split('\n')[0] || '';
                        onUpdateNote(note.id, group.id, { title, ...updated });
                      }} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {group.notes.length === 0 && (
                <div className="flex items-center justify-center h-24 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Drag notes here or create a new one</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
