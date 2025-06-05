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

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }
    // Standalone → Standalone (reorder)
    if (source.droppableId === STANDALONE_DROPPABLE_ID && destination.droppableId === STANDALONE_DROPPABLE_ID) {
      const newNotes = Array.from(standaloneNotes)
      const [moved] = newNotes.splice(source.index, 1)
      newNotes.splice(destination.index, 0, moved)
      const updates = newNotes.map((note, idx) => ({ id: note.id, position: idx, groupId: null }))
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      setStandaloneNotes(newNotes)
      return
    }
    // Group → Group (reorder within group)
    if (source.droppableId !== STANDALONE_DROPPABLE_ID && destination.droppableId !== STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const sourceGroupIndex = newGroups.findIndex((group) => group.id === source.droppableId)
      const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
      if (sourceGroupIndex === -1 || destGroupIndex === -1) return
      const [moved] = newGroups[sourceGroupIndex].notes.splice(source.index, 1)
      newGroups[destGroupIndex].notes.splice(destination.index, 0, moved)
      // If moved between different groups, update groupId
      if (sourceGroupIndex !== destGroupIndex) {
        moved.groupId = newGroups[destGroupIndex].id
      }
      const updates = [
        ...newGroups[sourceGroupIndex].notes.map((note, idx) => ({ id: note.id, position: idx, groupId: newGroups[sourceGroupIndex].id })),
        ...newGroups[destGroupIndex].notes.map((note, idx) => ({ id: note.id, position: idx, groupId: newGroups[destGroupIndex].id }))
      ]
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      setGroups(newGroups)
      return
    }
    // Group → Standalone (move from group to standalone)
    if (source.droppableId !== STANDALONE_DROPPABLE_ID && destination.droppableId === STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const sourceGroupIndex = newGroups.findIndex((group) => group.id === source.droppableId)
      if (sourceGroupIndex === -1) return
      const [moved] = newGroups[sourceGroupIndex].notes.splice(source.index, 1)
      moved.groupId = null
      const newNotes = Array.from(standaloneNotes)
      newNotes.splice(destination.index, 0, moved)
      const updates = [
        ...newGroups[sourceGroupIndex].notes.map((note, idx) => ({ id: note.id, position: idx, groupId: newGroups[sourceGroupIndex].id })),
        ...newNotes.map((note, idx) => ({ id: note.id, position: idx, groupId: null }))
      ]
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      setGroups(newGroups)
      setStandaloneNotes(newNotes)
      return
    }
    // Standalone → Group (move from standalone to group)
    if (source.droppableId === STANDALONE_DROPPABLE_ID && destination.droppableId !== STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
      if (destGroupIndex === -1) return
      const newNotes = Array.from(standaloneNotes)
      const [moved] = newNotes.splice(source.index, 1)
      moved.groupId = newGroups[destGroupIndex].id
      newGroups[destGroupIndex].notes.splice(destination.index, 0, moved)
      const updates = [
        ...newGroups[destGroupIndex].notes.map((note, idx) => ({ id: note.id, position: idx, groupId: newGroups[destGroupIndex].id })),
        ...newNotes.map((note, idx) => ({ id: note.id, position: idx, groupId: null }))
      ]
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      setGroups(newGroups)
      setStandaloneNotes(newNotes)
      return
    }
  }

  const handleCreateNote = async (note: Omit<Note, "id" | "createdAt">, groupId: string) => {
    const body = groupId === 'no-group'
      ? { ...note }
      : { ...note, groupId }
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const newNote = await res.json()
    if (groupId === 'no-group') {
      setStandaloneNotes(prev => [...prev, newNote])
    } else {
      setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: [...group.notes, newNote] } : group))
    }
    setIsCreateNoteOpen(false)
  }

  const handleCreateGroup = async () => {
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Group" }),
    })
    const newGroup = await res.json()
    setGroups(prev => [...prev, { ...newGroup, notes: [] }])
  }

  const handleDeleteNote = async (noteId: string, groupId: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: group.notes.filter(note => note.id !== noteId) } : group))
  }

  const handleUpdateGroup = async (groupId: string, title: string) => {
    await fetch("/api/groups", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId, title }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, title } : group))
  }

  const handleDeleteGroup = async (groupId: string) => {
    await fetch("/api/groups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId }),
    })
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId))
  }

  const handleUpdateNote = async (noteId: string, groupId: string, updated: { content: string }) => {
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId, ...updated }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: group.notes.map(note => note.id === noteId ? { ...note, ...updated } : note) } : group))
  }

  const handleDeleteStandaloneNote = async (noteId: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    })
    setStandaloneNotes(prev => prev.filter(note => note.id !== noteId))
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

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center px-2 py-3">
              <div className="flex items-center gap-2 font-semibold text-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Image src="/mark.png" alt="Noteprism Logo" width={32} height={32} className="rounded-lg" />
                </div>
                <span>Noteprism</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              <Input
                placeholder="Search notes..."
                className="h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex justify-between items-center">
                <span>Note Groups</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCreateGroup}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Group</span>
                </Button>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groups.map((group) => (
                    <SidebarMenuItem key={group.id}>
                      <SidebarMenuButton isActive={activeGroup === group.id} onClick={() => setActiveGroup(group.id)}>
                        <span>{group.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{group.notes.length}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">User</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
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
              <div className="flex gap-6 items-start">
                {standaloneNotes.length > 0 && (
                  <Droppable droppableId={STANDALONE_DROPPABLE_ID} direction="vertical">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col gap-4 w-full max-w-[400px] min-w-[260px]"
                      >
                        {standaloneNotes.map((note, idx) => (
                          <Draggable key={note.id} draggableId={note.id} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <NoteCard note={note} onDelete={() => handleDeleteStandaloneNote(note.id)} onUpdate={() => {}} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
                <div className="flex-1">
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
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
                </div>
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
