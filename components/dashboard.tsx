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

  const STANDALONE_DROPPABLE_ID = "standalone-notes"

  useEffect(() => {
    fetch("/api/groups")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setGroups(data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        setStandaloneNotes(data.filter((n: any) => !n.groupId))
      })
  }, [])

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
        />
        <div className="w-screen peer-data-[state=expanded]:w-[calc(100vw-16rem)] transition-[width] duration-200 ease-linear">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <Button onClick={() => setIsCreateNoteOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </header>
          <main className="p-4 md:p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {standaloneNotes.length > 0 && (
                  <NoteGroupless
                    standaloneNotes={standaloneNotes}
                    onDeleteStandaloneNote={handleDeleteStandaloneNote}
                    STANDALONE_DROPPABLE_ID={STANDALONE_DROPPABLE_ID}
                  />
                )}
                {filteredGroups.map((group) => (
                  <NoteGroup
                    key={group.id}
                    group={group}
                    onDeleteNote={handleDeleteNote}
                    onUpdateGroup={handleUpdateGroup}
                    onDeleteGroup={handleDeleteGroup}
                    onUpdateNote={handleUpdateNote}
                  />
                ))}
              </div>
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
