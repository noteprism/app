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
import { colorOptions } from "@/components/note-card"
import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import Image from "next/image"
import NoteCard from "@/components/note-card"
import NoteGroupless from "@/components/note-groupless"
import PanelLeft from "@/components/panel-left"
import { useNoteDragAndDrop } from "@/components/useNoteDragAndDrop"
import { useNoteActions } from "@/components/note-actions"
import Masonry from 'react-masonry-css'

// Constants for sidebar
const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export default function Dashboard() {
  const [groups, setGroups] = useState<NoteGroupType[]>([])
  const [standaloneNotes, setStandaloneNotes] = useState<Note[]>([])

  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

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
          data.filter((n: Note) => !n.noteGroupId && !n.groupId).sort((a: Note, b: Note) => (a.position ?? 0) - (b.position ?? 0))
        )
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
    try {
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)].value
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "", color }),
    })
      
      if (!res.ok) {
        console.error("Error creating note:", await res.text())
        return
      }
      
    const newNote = await res.json()
      
      // Update positions in frontend to match what we just did in the backend
      setStandaloneNotes(prev => {
        // New note is at position 0, and all others shift down
        const updated = prev.map(note => ({
          ...note,
          position: (note.position ?? 0) + 1
        }))
        
        // Insert new note at the beginning
        return [newNote, ...updated]
      })
      
    setEditingNoteId(newNote.id)
    } catch (error) {
      console.error("Failed to create note:", error)
    }
  }

  // Define breakpoints for the masonry layout
  const breakpointColumnsObj = {
    default: 4,
    1600: 3,
    1200: 2,
    900: 2,
    600: 1
  };

  // Add responsive sidebar class based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=collapsed; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DragDropContext onDragEnd={handleAnyDragEnd}>
      <SidebarProvider>
        <div className="flex h-screen bg-background">
          <PanelLeft
            groups={groups}
            handleCreateGroup={handleCreateGroup}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNewNote={handleNewNote}
            onUpdateGroup={handleUpdateGroup}
          />
          
          <div className="flex-1 transition-[width] duration-200 ease-linear">
            <main className="p-4 pt-16 md:p-6 md:pt-16 bg-background text-foreground">
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {filteredStandaloneNotes.length > 0 && (
                  <div className="mb-6">
                    <NoteGroupless
                      standaloneNotes={filteredStandaloneNotes}
                      onDeleteStandaloneNote={handleDeleteStandaloneNote}
                      onUpdateStandaloneNote={handleUpdateStandaloneNote}
                      STANDALONE_DROPPABLE_ID={STANDALONE_DROPPABLE_ID}
                      editingNoteId={editingNoteId}
                      setEditingNoteId={setEditingNoteId}
                      cardStyle="outline"
                    />
                  </div>
                )}
                {filteredGroups.map((group) => (
                  <div key={group.id} className="mb-6">
                    <NoteGroup
                      group={group}
                      onDeleteNote={handleDeleteNote}
                      onUpdateGroup={handleUpdateGroup}
                      onDeleteGroup={handleDeleteGroup}
                      onUpdateNote={handleUpdateNote}
                      cardStyle="outline"
                    />
                  </div>
                ))}
              </Masonry>
            </main>
          </div>
        </div>
      </SidebarProvider>

      <CreateNoteDialog
        open={isCreateNoteOpen}
        onOpenChange={setIsCreateNoteOpen}
        groups={groups}
        onCreateNote={handleCreateNote}
      />
    </DragDropContext>
  )
}
