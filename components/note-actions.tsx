import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import { useCallback } from "react"
import { generateGroupName } from "@/lib/group/names"
import { useState } from "react"
import { nanoid } from "nanoid"
import { colorOptions } from "@/components/note-card"

interface UseNoteActionsProps {
  setGroups: React.Dispatch<React.SetStateAction<NoteGroupType[]>>
  setStandaloneNotes: React.Dispatch<React.SetStateAction<Note[]>>
  setIsCreateNoteOpen: React.Dispatch<React.SetStateAction<boolean>>
  isPublic?: boolean
}

export function useNoteActions({
  setGroups,
  setStandaloneNotes,
  setIsCreateNoteOpen,
  isPublic = false
}: UseNoteActionsProps) {
  const handleCreateNote = async (note: Omit<Note, "id" | "createdAt">, groupId: string) => {
    if (isPublic) {
      // In public mode, create demo note in state
      const newNote: Note = {
        id: `demo-${nanoid()}`,
        content: note.content,
        color: note.color,
        position: note.position ?? 0,
        createdAt: new Date().toISOString(),
        ...(groupId !== 'no-group' && { noteGroupId: groupId })
      };

      if (groupId !== 'no-group') {
        // Add to specific group
        setGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                notes: [newNote, ...group.notes.map(n => ({ ...n, position: (n.position ?? 0) + 1 }))]
              }
            : group
        ));
      } else {
        // Add to standalone notes
        setStandaloneNotes(prev => {
          const updated = prev.map(n => ({
            ...n,
            position: (n.position ?? 0) + 1
          }));
          return [newNote, ...updated];
        });
      }
      setIsCreateNoteOpen(false);
      return;
    }

    try {
      const body = groupId === 'no-group'
        ? { ...note }
        : { ...note, groupId };
        
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Error creating note:", await res.text());
        return;
      }

      const newNote = await res.json();

      if (groupId !== 'no-group') {
        setGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                notes: [newNote, ...group.notes.map(n => ({ ...n, position: (n.position ?? 0) + 1 }))]
              }
            : group
        ));
      } else {
        setStandaloneNotes(prev => {
          const updated = prev.map(n => ({
            ...n,
            position: (n.position ?? 0) + 1
          }));
          return [newNote, ...updated];
        });
      }
      setIsCreateNoteOpen(false);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }

  const handleCreateGroup = async () => {
    if (isPublic) {
      // In public mode, create demo group in state
      const newGroup: NoteGroupType = {
        id: `demo-group-${nanoid()}`,
        name: "New Group",
        notes: []
      };
      
      setGroups(prev => [...prev, newGroup]);
      return;
    }

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Group" }),
      })

      if (!res.ok) {
        console.error("Error creating group:", await res.text())
        return
      }

      const newGroup = await res.json()
      setGroups(prev => [...prev, newGroup])
    } catch (error) {
      console.error("Failed to create group:", error)
    }
  }

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