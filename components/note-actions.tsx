import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import { useCallback } from "react"
import { generateGroupName } from "@/lib/group/names"

interface UseNoteActionsProps {
  setGroups: React.Dispatch<React.SetStateAction<NoteGroupType[]>>
  setStandaloneNotes: React.Dispatch<React.SetStateAction<Note[]>>
  setIsCreateNoteOpen: (open: boolean) => void
}

export function useNoteActions({ setGroups, setStandaloneNotes, setIsCreateNoteOpen }: UseNoteActionsProps) {
  const handleCreateNote = useCallback(async (note: Omit<Note, "id" | "createdAt">, groupId: string) => {
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
      setStandaloneNotes(prev => [newNote, ...prev])
    } else {
      setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: [...group.notes, newNote] } : group))
    }
    setIsCreateNoteOpen(false)
  }, [setGroups, setStandaloneNotes, setIsCreateNoteOpen])

  const handleCreateGroup = useCallback(async () => {
    const generatedName = generateGroupName();
    
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: generatedName }),
    })
    const newGroup = await res.json()
    setGroups(prev => [...prev, { ...newGroup, notes: [] }])
  }, [setGroups])

  const handleDeleteNote = useCallback(async (noteId: string, groupId: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: group.notes.filter(note => note.id !== noteId) } : group))
  }, [setGroups])

  const handleUpdateGroup = useCallback(async (groupId: string, name: string) => {
    await fetch("/api/groups", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId, name }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, name } : group))
  }, [setGroups])

  const handleDeleteGroup = useCallback(async (groupId: string) => {
    await fetch("/api/groups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId }),
    })
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId))
  }, [setGroups])

  const handleUpdateNote = useCallback(async (noteId: string, groupId: string, updated: { content: string, color?: string }) => {
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId, ...updated }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: group.notes.map(note => note.id === noteId ? { ...note, ...updated } : note) } : group))
  }, [setGroups])

  const handleDeleteStandaloneNote = useCallback(async (noteId: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    })
    setStandaloneNotes(prev => prev.filter(note => note.id !== noteId))
  }, [setStandaloneNotes])

  return {
    handleCreateNote,
    handleCreateGroup,
    handleDeleteNote,
    handleUpdateGroup,
    handleDeleteGroup,
    handleUpdateNote,
    handleDeleteStandaloneNote,
  }
} 