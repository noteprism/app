"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { PlusCircle, Search, Settings, User, Plus, LogIn, CheckCircle } from "lucide-react"
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
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Constants for sidebar
const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

// Sample data for public mode
const sampleGroups: NoteGroupType[] = [
  {
    id: "sample-group-1",
    name: "Project Ideas",
    notes: [
      {
        id: "sample-note-1",
        content: "Build a personal website with Next.js and Tailwind",
        color: "#3b82f6",
        position: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: "sample-note-2",
        content: "Create a mobile app for tracking daily habits",
        color: "#10b981",
        position: 1,
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: "sample-group-2",
    name: "Learning Goals",
    notes: [
      {
        id: "sample-note-3",
        content: "Complete React advanced patterns course",
        color: "#f59e0b",
        position: 0,
        createdAt: new Date().toISOString(),
      }
    ]
  }
];

const sampleStandaloneNotes: Note[] = [
  {
    id: "sample-standalone-1",
    content: "Welcome to Noteprism! This is a sample note to show you how the app works. Sign up to create your own notes and groups.",
    color: "#6366f1",
    position: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-standalone-2",
    content: "Click here to sign up for an account and start organizing your notes!",
    color: "#ec4899",
    position: 1,
    createdAt: new Date().toISOString(),
  }
];

interface DashboardProps {
  isPublic?: boolean;
  showSubscriptionSuccess?: boolean;
}

export default function Dashboard({ isPublic = false, showSubscriptionSuccess = false }: DashboardProps) {
  const [groups, setGroups] = useState<NoteGroupType[]>([])
  const [standaloneNotes, setStandaloneNotes] = useState<Note[]>([])
  const [userSubscription, setUserSubscription] = useState<{
    plan: string | null;
    status: string | null;
    canManageBilling: boolean;
    trialEndsAt: string | null;
    trialEndingSoon: boolean;
  }>({
    plan: null,
    status: null,
    canManageBilling: false,
    trialEndsAt: null,
    trialEndingSoon: false
  });

  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const router = useRouter()

  const STANDALONE_DROPPABLE_ID = "standalone-notes"

  useEffect(() => {
    // In public mode, use sample data instead of fetching from API
    if (isPublic) {
      setGroups(sampleGroups);
      setStandaloneNotes(sampleStandaloneNotes);
      return;
    }

    // Only fetch data if not in public mode
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
  }, [isPublic])

  useEffect(() => {
    if (isPublic) return;
    
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        setStandaloneNotes(
          data.filter((n: Note) => !n.noteGroupId && !n.groupId).sort((a: Note, b: Note) => (a.position ?? 0) - (b.position ?? 0))
        )
      })
  }, [isPublic])

  useEffect(() => {
    if (isPublic) return;
    
    fetch("/api/user")
      .then(res => res.json())
      .then(data => {
        if (data && data.subscription) {
          setUserSubscription(data.subscription);
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, [isPublic]);

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
    if (isPublic) {
      // In public mode, just update the state without API calls
      setStandaloneNotes(prev => prev.map(note => note.id === noteId ? { ...note, ...updated } : note));
      return;
    }
    
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
    // If in public mode, just update the UI state without API calls
    if (isPublic) {
      handleDragEnd(result);
      return;
    }
    
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
    if (isPublic) {
      // In public mode, redirect to connect page
      router.push('/connect');
      return;
    }
    
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

  // Adjust column count based on search results for better layout
  const getColumnCount = () => {
    const totalItems = filteredStandaloneNotes.length + filteredGroups.length;
    if (searchQuery && totalItems <= 2) {
      return Math.max(totalItems, 1);
    }
    return breakpointColumnsObj;
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
  
  // Check for checkout success parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    
    if (checkout === 'success') {
      // Clear the checkout parameter from URL without reloading the page
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      window.history.replaceState({}, '', url);
    }
  }, []);

  return (
    <SidebarProvider
      defaultState="open"
      cookieName={SIDEBAR_COOKIE_NAME}
      cookieMaxAge={SIDEBAR_COOKIE_MAX_AGE}
    >
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <PanelLeft />
        <div className="flex w-full flex-col overflow-hidden">
          <div className="flex h-16 items-center border-b px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="hidden md:flex">
                <Image src="/mark.png" alt="Noteprism" width={32} height={32} />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Noteprism</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative w-full max-w-[440px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className="w-full bg-background pl-8 md:w-[300px] lg:w-[440px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {!isPublic ? (
                <Link href="/api/auth/logout">
                  <Button variant="ghost" size="icon">
                    <LogIn className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/connect">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </div>
          
          {showSubscriptionSuccess && (
            <Alert className="mx-6 mt-4 bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                Your subscription has been activated successfully! You now have full access to all features.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold md:text-xl">All Notes</h2>
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => setIsCreateNoteOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>
            
            <DragDropContext onDragEnd={handleAnyDragEnd}>
              <div className={searchQuery ? 'search-filtered-container' : ''}>
                <Masonry
                  breakpointCols={getColumnCount()}
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
              </div>
            </DragDropContext>
          </div>
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
