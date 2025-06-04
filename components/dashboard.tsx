"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
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

export default function Dashboard() {
  const [groups, setGroups] = useState<NoteGroupType[]>([])

  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Find the note that was dragged
    let draggedNote: Note | null = null
    let sourceGroupIndex = -1

    for (let i = 0; i < groups.length; i++) {
      const noteIndex = groups[i].notes.findIndex((note) => note.id === draggableId)
      if (noteIndex !== -1) {
        draggedNote = groups[i].notes[noteIndex]
        sourceGroupIndex = i
        break
      }
    }

    if (!draggedNote) return

    const newGroups = [...groups]

    // Remove from source
    newGroups[sourceGroupIndex].notes.splice(source.index, 1)

    // Add to destination
    const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
    newGroups[destGroupIndex].notes.splice(destination.index, 0, draggedNote)

    setGroups(newGroups)
  }

  const handleCreateNote = async (note: Omit<Note, "id" | "createdAt">, groupId: string) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, groupId }),
    })
    const newNote = await res.json()
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: [...group.notes, newNote] } : group))
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
      <div className="flex h-screen bg-gray-50">
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
        <div className="flex-1 overflow-auto">
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
