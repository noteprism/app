import { useCallback } from "react"
import type { Note, NoteGroup as NoteGroupType } from "@/types/notes"
import type { DropResult } from "@hello-pangea/dnd"

interface UseNoteDragAndDropProps {
  groups: NoteGroupType[]
  setGroups: React.Dispatch<React.SetStateAction<NoteGroupType[]>>
  standaloneNotes: Note[]
  setStandaloneNotes: React.Dispatch<React.SetStateAction<Note[]>>
  STANDALONE_DROPPABLE_ID: string
}

export function useNoteDragAndDrop({
  groups,
  setGroups,
  standaloneNotes,
  setStandaloneNotes,
  STANDALONE_DROPPABLE_ID,
}: UseNoteDragAndDropProps) {
  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }
    // Standalone → Standalone (reorder)
    if (source.droppableId === STANDALONE_DROPPABLE_ID && destination.droppableId === STANDALONE_DROPPABLE_ID) {
      const newNotes = Array.from(standaloneNotes)
      const [moved] = newNotes.splice(source.index, 1)
      newNotes.splice(destination.index, 0, moved)
      
      // Explicitly update position values for all standalone notes
      const updatedNotes = newNotes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Prepare the updates to send to the backend
      const updates = updatedNotes.map(note => ({ 
        id: note.id, 
        position: note.position, 
        groupId: null 
      }))
      
      // Update the backend
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      // Update the frontend state
      setStandaloneNotes(updatedNotes)
      return
    }
    // Group → Group (reorder within group)
    if (source.droppableId !== STANDALONE_DROPPABLE_ID && destination.droppableId !== STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const sourceGroupIndex = newGroups.findIndex((group) => group.id === source.droppableId)
      const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
      if (sourceGroupIndex === -1 || destGroupIndex === -1) return
      
      // Remove the note from source
      const [moved] = newGroups[sourceGroupIndex].notes.splice(source.index, 1)
      
      // Add the note to destination
      newGroups[destGroupIndex].notes.splice(destination.index, 0, moved)
      
      // If moved between different groups, update groupId
      if (sourceGroupIndex !== destGroupIndex) {
        moved.groupId = newGroups[destGroupIndex].id
      }
      
      // Update all positions in both affected groups
      const sourceNotes = newGroups[sourceGroupIndex].notes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      const destNotes = sourceGroupIndex === destGroupIndex
        ? sourceNotes // If same group, we already updated positions above
        : newGroups[destGroupIndex].notes.map((note, idx) => ({
            ...note,
            position: idx
          }))
      
      // Apply updated positions back to groups
      newGroups[sourceGroupIndex].notes = sourceNotes
      newGroups[destGroupIndex].notes = destNotes
      
      // Prepare updates for the backend
      const updates = [
        ...sourceNotes.map(note => ({ id: note.id, position: note.position, groupId: newGroups[sourceGroupIndex].id })),
        ...(sourceGroupIndex === destGroupIndex 
          ? [] // If same group, avoid duplicate updates
          : destNotes.map(note => ({ id: note.id, position: note.position, groupId: newGroups[destGroupIndex].id }))
        )
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
      
      // Remove note from source group
      const [moved] = newGroups[sourceGroupIndex].notes.splice(source.index, 1)
      
      // Clear both groupId and noteGroupId to ensure consistency
      moved.groupId = null
      moved.noteGroupId = null
      
      // Add note to standalone notes
      const newNotes = Array.from(standaloneNotes)
      newNotes.splice(destination.index, 0, moved)
      
      // Update positions in source group
      const sourceNotes = newGroups[sourceGroupIndex].notes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Update positions in standalone notes
      const updatedStandaloneNotes = newNotes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Apply updated positions back to state
      newGroups[sourceGroupIndex].notes = sourceNotes
      
      // Prepare updates for the backend
      const updates = [
        ...sourceNotes.map(note => ({ 
          id: note.id, 
          position: note.position, 
          groupId: newGroups[sourceGroupIndex].id 
        })),
        ...updatedStandaloneNotes.map(note => ({ 
          id: note.id, 
          position: note.position, 
          groupId: null 
        }))
      ]
      
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      setGroups(newGroups)
      setStandaloneNotes(updatedStandaloneNotes)
      return
    }
    // Standalone → Group (move from standalone to group)
    if (source.droppableId === STANDALONE_DROPPABLE_ID && destination.droppableId !== STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
      if (destGroupIndex === -1) return
      
      // Remove note from standalone
      const newStandaloneNotes = Array.from(standaloneNotes)
      const [moved] = newStandaloneNotes.splice(source.index, 1)
      
      // Update both groupId and noteGroupId to ensure consistency
      moved.groupId = newGroups[destGroupIndex].id
      moved.noteGroupId = newGroups[destGroupIndex].id
      
      // Add note to destination group
      newGroups[destGroupIndex].notes.splice(destination.index, 0, moved)
      
      // Update positions in standalone notes
      const updatedStandaloneNotes = newStandaloneNotes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Update positions in destination group
      const destNotes = newGroups[destGroupIndex].notes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Apply updated positions back to state
      newGroups[destGroupIndex].notes = destNotes
      
      // Prepare updates for the backend
      const updates = [
        ...destNotes.map(note => ({ 
          id: note.id, 
          position: note.position, 
          groupId: newGroups[destGroupIndex].id 
        })),
        ...updatedStandaloneNotes.map(note => ({ 
          id: note.id, 
          position: note.position, 
          groupId: null 
        }))
      ]
      
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      setGroups(newGroups)
      setStandaloneNotes(updatedStandaloneNotes)
      return
    }
  }, [groups, setGroups, standaloneNotes, setStandaloneNotes, STANDALONE_DROPPABLE_ID])

  return { handleDragEnd }
} 