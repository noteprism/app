import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import { useCallback } from "react"
import { generateGroupName } from "@/lib/group/names"

interface UseNoteActionsProps {
  setGroups: React.Dispatch<React.SetStateAction<NoteGroupType[]>>
  setStandaloneNotes: React.Dispatch<React.SetStateAction<Note[]>>
  setIsCreateNoteOpen: (open: boolean) => void
  isPublic?: boolean
}

export function useNoteActions({ setGroups, setStandaloneNotes, setIsCreateNoteOpen, isPublic = false }: UseNoteActionsProps) {
  const handleCreateNote = useCallback(async (note: Omit<Note, "id" | "createdAt">, groupId: string) => {
    if (isPublic) {
      // In public mode, create a temporary note with a generated ID
      const tempId = 'temp-' + Math.random().toString(36).substring(2, 11);
      const newNote = {
        ...note,
        id: tempId,
        createdAt: new Date().toISOString(),
      };
      
      if (groupId === 'no-group') {
        setStandaloneNotes(prev => [newNote, ...prev]);
      } else {
        setGroups(prevGroups => prevGroups.map(group => 
          group.id === groupId ? { ...group, notes: [...group.notes, newNote] } : group
        ));
      }
      setIsCreateNoteOpen(false);
      return;
    }
    
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
  }, [setGroups, setStandaloneNotes, setIsCreateNoteOpen, isPublic])

  const handleCreateGroup = useCallback(async () => {
    const generatedName = generateGroupName();
    
    if (isPublic) {
      // In public mode, create a temporary group with a generated ID
      const tempId = 'temp-' + Math.random().toString(36).substring(2, 11);
      const newGroup = {
        id: tempId,
        name: generatedName,
        position: 0,
        notes: []
      };
      setGroups(prev => [...prev, newGroup]);
      return;
    }
    
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: generatedName }),
    })
    const newGroup = await res.json()
    setGroups(prev => [...prev, { ...newGroup, notes: [] }])
  }, [setGroups, isPublic])

  const handleDeleteNote = useCallback(async (noteId: string, groupId: string) => {
    if (isPublic) {
      // In public mode, just update the state
      setGroups(prevGroups => prevGroups.map(group => 
        group.id === groupId ? { ...group, notes: group.notes.filter(note => note.id !== noteId) } : group
      ));
      return;
    }
    
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: group.notes.filter(note => note.id !== noteId) } : group))
  }, [setGroups, isPublic])

  const handleUpdateGroup = useCallback(async (groupId: string, name: string) => {
    if (isPublic) {
      // In public mode, just update the state
      setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, name } : group));
      return;
    }
    
    await fetch("/api/groups", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId, name }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, name } : group))
  }, [setGroups, isPublic])

  const handleDeleteGroup = useCallback(async (groupId: string) => {
    if (isPublic) {
      // In public mode, just update the state
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      return;
    }
    
    await fetch("/api/groups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: groupId }),
    })
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId))
  }, [setGroups, isPublic])

  const handleUpdateNote = useCallback(async (noteId: string, groupId: string, updated: { content: string, color?: string }) => {
    if (isPublic) {
      // In public mode, just update the state
      setGroups(prevGroups => prevGroups.map(group => 
        group.id === groupId ? { 
          ...group, 
          notes: group.notes.map(note => note.id === noteId ? { ...note, ...updated } : note) 
        } : group
      ));
      return;
    }
    
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId, ...updated }),
    })
    setGroups(prevGroups => prevGroups.map(group => group.id === groupId ? { ...group, notes: group.notes.map(note => note.id === noteId ? { ...note, ...updated } : note) } : group))
  }, [setGroups, isPublic])

  const handleDeleteStandaloneNote = useCallback(async (noteId: string) => {
    if (isPublic) {
      // In public mode, just update the state
      setStandaloneNotes(prev => prev.filter(note => note.id !== noteId));
      return;
    }
    
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteId }),
    })
    setStandaloneNotes(prev => prev.filter(note => note.id !== noteId))
  }, [setStandaloneNotes, isPublic])

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