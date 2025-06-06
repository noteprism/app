"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { PlusCircle, Search, Settings, User, Plus } from "lucide-react"
import { nanoid } from "nanoid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import NoteGroup from "@/components/note-group"
import CreateNoteDialog from "@/components/create-note-dialog"
import { colorOptions } from "@/components/create-note-dialog"
import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import Image from "next/image"
import NoteCard from "@/components/note-card"
import NoteGroupless from "@/components/note-groupless"
import PanelLeft from "@/components/panel-left"
import { useNoteDragAndDrop } from "@/components/useNoteDragAndDrop"
import { useNoteActions } from "@/components/note-actions"

export default function Dashboard() {
  const [groups, setGroups] = useState<NoteGroupType[]>([])
  const [standaloneNotes, setStandaloneNotes] = useState<Note[]>([])

  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [cardStyle, setCardStyleState] = useState<"outline" | "filled">("outline")

  const STANDALONE_DROPPABLE_ID = "standalone-notes"

  useEffect(() => {
    fetch("/api/groups")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setGroups(
            data.map((group: NoteGroupType) => ({
              ...group,
              notes: group.notes.sort((a: Note, b: Note) => (a.position ?? 0) - (b.position ?? 0))
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        setStandaloneNotes(
          data.filter((n: Note) => !n.groupId).sort((a: Note, b: Note) => (a.position ?? 0) - (b.position ?? 0))
        )
      })
  }, [])

  // Load note style from API on mount
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && (data.noteStyle === "outline" || data.noteStyle === "filled")) {
          setCardStyleState(data.noteStyle)
        }
      })
      .catch(() => {})
  }, [])

  // Save note style to API when changed
  const setCardStyle = (style: "outline" | "filled") => {
    setCardStyleState(style)
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteStyle: style })
    })
  }

  const { handleDragEnd } = useNoteDragAndDrop({
    groups,
    setGroups,
    standaloneNotes,
    setStandaloneNotes,
    STANDALONE_DROPPABLE_ID,
  })

  const noteActions = useNoteActions({
    setGroups,
    setStandaloneNotes,
    setIsCreateNoteOpen,
  })
  const {
    handleCreateNote,
    handleCreateGroup,
    handleDeleteNote,
    handleUpdateGroup,
    handleDeleteGroup,
    handleUpdateNote,
    handleDeleteStandaloneNote,
  } = noteActions

  const handleUpdateStandaloneNote = async (noteId: string, updated: { content: string, color?: string }) => {
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId, ...updated }),
    })
    setStandaloneNotes(prev => prev.map(note => note.id === noteId ? { ...note, ...updated } : note))
  }

  const filteredGroups = searchQuery
    ? groups
        .map((group) => ({
          ...group,
          notes: group.notes.filter(
            (note) =>
              note.content.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((group) => group.notes.length > 0)
    : groups

  // Filter standalone notes by search query as well
  const filteredStandaloneNotes = searchQuery
    ? standaloneNotes.filter(note => note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : standaloneNotes

  // Handle drag end for groups and notes
  const handleAnyDragEnd = async (result: DropResult) => {
    // If dragging a group (top-level), handle group reorder
    if (result.type === 'group') {
      if (!result.destination) return
      const reordered = Array.from(groups)
      const [removed] = reordered.splice(result.source.index, 1)
      reordered.splice(result.destination.index, 0, removed)
      // Update positions in state
      const updated = reordered.map((g, i) => ({ ...g, position: i }))
      setGroups(updated)
      // Persist to backend
      await fetch("/api/groups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions: updated.map(g => ({ id: g.id, position: g.position })) })
      })
      return
    }
    // Otherwise, handle note drag-and-drop
    handleDragEnd(result)
  }

  const handleNewNote = async () => {
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)].value
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "", color }),
    })
    const newNote = await res.json()
    setStandaloneNotes(prev => [newNote, ...prev])
    setEditingNoteId(newNote.id)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white">
        <PanelLeft
          groups={groups}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          handleCreateGroup={handleCreateGroup}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewNote={handleNewNote}
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
        />
        <div className="w-screen peer-data-[state=expanded]:w-[calc(100vw-16rem)] transition-[width] duration-200 ease-linear">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>
          <main className="p-4 md:p-6">
            <DragDropContext onDragEnd={handleAnyDragEnd}>
              <Droppable droppableId="groups-droppable" direction="vertical" type="group">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
                  >
                    {filteredStandaloneNotes.length > 0 && (
                      <NoteGroupless
                        standaloneNotes={filteredStandaloneNotes}
                        onDeleteStandaloneNote={handleDeleteStandaloneNote}
                        onUpdateStandaloneNote={handleUpdateStandaloneNote}
                        STANDALONE_DROPPABLE_ID={STANDALONE_DROPPABLE_ID}
                        editingNoteId={editingNoteId}
                        setEditingNoteId={setEditingNoteId}
                        cardStyle={cardStyle}
                      />
                    )}
                    {filteredGroups.map((group, idx) => (
                      <Draggable key={group.id} draggableId={group.id} index={idx}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <NoteGroup
                              group={group}
                              onDeleteNote={handleDeleteNote}
                              onUpdateGroup={handleUpdateGroup}
                              onDeleteGroup={handleDeleteGroup}
                              onUpdateNote={handleUpdateNote}
                              cardStyle={cardStyle}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </main>
        </div>
      </div>
      <CreateNoteDialog
        open={isCreateNoteOpen}
        onOpenChange={setIsCreateNoteOpen}
        groups={groups}
        onCreateNote={handleCreateNote}
      />
    </SidebarProvider>
  )
}
