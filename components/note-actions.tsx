import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import { useCallback } from "react"
import { generateGroupName } from "@/lib/group/names"
import { nanoid } from "nanoid"

interface UseNoteActionsProps {
  setGroups: React.Dispatch<React.SetStateAction<NoteGroupType[]>>
  setStandaloneNotes: React.Dispatch<React.SetStateAction<Note[]>>
  setIsCreateNoteOpen: (open: boolean) => void
  isPublic?: boolean
}

export function useNoteActions({ setGroups, setStandaloneNotes, setIsCreateNoteOpen, isPublic = false }: UseNoteActionsProps) {
  const handleCreateNote = async (note: Omit<Note, "id" | "createdAt">, groupId: string) => {
    if (isPublic) {
      // In public mode, create note and update state
      const newNote: Note = {
        id: nanoid(),
        ...note,
        position: 0,
        createdAt: new Date().toISOString(),
      }

      if (groupId) {
        // Add to group
        setGroups(prev => {
          const updated = prev.map(group => {
            if (group.id === groupId) {
              const updatedNotes = group.notes.map(note => ({
                ...note,
                position: (note.position ?? 0) + 1
              }))
              const finalNotes = [newNote, ...updatedNotes];
              return { ...group, notes: finalNotes };
            }
            return group;
          });
          // Save to localStorage
          localStorage.setItem('noteprism_demo_groups', JSON.stringify(updated));
          return updated;
        });
      } else {
        // Add as standalone note
        setStandaloneNotes(prev => {
          const updatedNotes = prev.map(note => ({
            ...note,
            position: (note.position ?? 0) + 1
          }))
          const finalNotes = [newNote, ...updatedNotes];
          // Save to localStorage
          localStorage.setItem('noteprism_demo_notes', JSON.stringify(finalNotes));
          return finalNotes;
        });
      }
      return;
    }

    // Original API logic
    try {
      const noteData: any = { ...note };
      if (groupId !== 'no-group') {
        noteData.noteGroupId = groupId;
      }

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      if (!res.ok) {
        console.error("Error creating note:", await res.text());
        return;
      }

      const newNote = await res.json();

      if (groupId !== 'no-group') {
        setGroups(prev => prev.map(group => {
          if (group.id === groupId) {
            const updatedNotes = group.notes.map(note => ({
              ...note,
              position: (note.position ?? 0) + 1
            }))
            return { ...group, notes: [newNote, ...updatedNotes] };
          }
          return group;
        }));
      } else {
        setStandaloneNotes(prev => {
          const updated = prev.map(note => ({
            ...note,
            position: (note.position ?? 0) + 1
          }))
          return [newNote, ...updated];
        });
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }

  const handleCreateGroup = async () => {
    if (isPublic) {
      // In public mode, create group and update state
      const newGroup: NoteGroupType = {
        id: nanoid(),
        name: "New Group",
        notes: []
      }
      
      setGroups(prev => {
        const updated = [...prev, newGroup];
        // Save to localStorage
        localStorage.setItem('noteprism_demo_groups', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Original API logic
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Group" }),
      });

      if (!res.ok) {
        console.error("Error creating group:", await res.text());
        return;
      }

      const newGroup = await res.json();
      setGroups(prev => [...prev, newGroup]);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  }

  const handleDeleteNote = async (noteId: string, groupId: string) => {
    if (isPublic) {
      // In public mode, delete and update state
      setGroups(prev => {
        const updated = prev.map(group => {
          if (group.id === groupId) {
            return { ...group, notes: group.notes.filter(note => note.id !== noteId) };
          }
          return group;
        });
        // Save to localStorage
        localStorage.setItem('noteprism_demo_groups', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Original API logic
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });

      if (!res.ok) {
        console.error("Error deleting note:", await res.text());
        return;
      }

      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return { ...group, notes: group.notes.filter(note => note.id !== noteId) };
        }
        return group;
      }));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  }

  const handleUpdateGroup = async (groupId: string, name: string) => {
    if (isPublic) {
      // In public mode, update and save state
      setGroups(prev => {
        const updated = prev.map(group => 
          group.id === groupId ? { ...group, name } : group
        );
        // Save to localStorage
        localStorage.setItem('noteprism_demo_groups', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Original API logic
    try {
      const res = await fetch("/api/groups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: groupId, name }),
      });

      if (!res.ok) {
        console.error("Error updating group:", await res.text());
        return;
      }

      setGroups(prev => prev.map(group => 
        group.id === groupId ? { ...group, name } : group
      ));
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (isPublic) {
      // In public mode, delete and update state
      setGroups(prev => {
        const updated = prev.filter(group => group.id !== groupId);
        // Save to localStorage
        localStorage.setItem('noteprism_demo_groups', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Original API logic
    try {
      const res = await fetch("/api/groups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: groupId }),
      });

      if (!res.ok) {
        console.error("Error deleting group:", await res.text());
        return;
      }

      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  }

  const handleUpdateNote = async (noteId: string, groupId: string, updated: { content: string, color?: string }) => {
    if (isPublic) {
      // In public mode, update and save state
      setGroups(prev => {
        const updatedGroups = prev.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              notes: group.notes.map(note => note.id === noteId ? { ...note, ...updated } : note)
            };
          }
          return group;
        });
        // Save to localStorage
        localStorage.setItem('noteprism_demo_groups', JSON.stringify(updatedGroups));
        return updatedGroups;
      });
      return;
    }

    // Original API logic
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId, ...updated }),
      });

      if (!res.ok) {
        console.error("Error updating note:", await res.text());
        return;
      }

      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            notes: group.notes.map(note => note.id === noteId ? { ...note, ...updated } : note)
          };
        }
        return group;
      }));
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  }

  const handleDeleteStandaloneNote = async (noteId: string) => {
    if (isPublic) {
      // In public mode, delete and update state
      setStandaloneNotes(prev => {
        const updatedNotes = prev.filter(note => note.id !== noteId);
        // Save to localStorage
        localStorage.setItem('noteprism_demo_notes', JSON.stringify(updatedNotes));
        return updatedNotes;
      });
      return;
    }

    // Original API logic
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });

      if (!res.ok) {
        console.error("Error deleting note:", await res.text());
        return;
      }

      setStandaloneNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  }

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