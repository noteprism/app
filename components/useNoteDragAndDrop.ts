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
      const movedNote = {...newNotes[source.index]} // Create a proper copy
      newNotes.splice(source.index, 1)
      newNotes.splice(destination.index, 0, movedNote)
      
      // Update positions
      const updatedNotes = newNotes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Create minimal update objects
      const updates = updatedNotes.map(note => ({
        id: note.id,
        position: note.position,
        groupId: null
      }))
      
      // Update backend
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      // Update frontend
      setStandaloneNotes(updatedNotes)
      return
    }
    
    // Group → Group (reorder within group or between groups)
    if (source.droppableId !== STANDALONE_DROPPABLE_ID && destination.droppableId !== STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const sourceGroupIndex = newGroups.findIndex((group) => group.id === source.droppableId)
      const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
      if (sourceGroupIndex === -1 || destGroupIndex === -1) return
      
      // Create a complete copy of the moved note with all properties
      const movedNote = JSON.parse(JSON.stringify(newGroups[sourceGroupIndex].notes[source.index]))
      
      // Remove from source
      newGroups[sourceGroupIndex].notes.splice(source.index, 1)
      
      // Add to destination
      newGroups[destGroupIndex].notes.splice(destination.index, 0, movedNote)
      
      // Update groupId if moving between groups
      if (sourceGroupIndex !== destGroupIndex) {
        movedNote.groupId = newGroups[destGroupIndex].id
        movedNote.noteGroupId = newGroups[destGroupIndex].id
      }
      
      // Update positions
      const sourceNotes = newGroups[sourceGroupIndex].notes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      const destNotes = sourceGroupIndex === destGroupIndex
        ? sourceNotes // If same group, we already updated positions
        : newGroups[destGroupIndex].notes.map((note, idx) => ({
            ...note,
            position: idx
          }))
      
      // Apply position updates
      newGroups[sourceGroupIndex].notes = sourceNotes
      newGroups[destGroupIndex].notes = destNotes
      
      // Create minimal update objects for the backend
      const updates = []
      
      // Add source group updates
      for (const note of sourceNotes) {
        const update = {
          id: note.id,
          position: note.position,
          groupId: newGroups[sourceGroupIndex].id
        }
        updates.push(update)
      }
      
      // Add destination group updates (if different from source)
      if (sourceGroupIndex !== destGroupIndex) {
        for (const note of destNotes) {
          const update = {
            id: note.id,
            position: note.position,
            groupId: newGroups[destGroupIndex].id
          }
          updates.push(update)
        }
      }
      
      // Update backend
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      // Update frontend
      setGroups(newGroups)
      return
    }
    
    // Group → Standalone (move from group to standalone)
    if (source.droppableId !== STANDALONE_DROPPABLE_ID && destination.droppableId === STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const sourceGroupIndex = newGroups.findIndex((group) => group.id === source.droppableId)
      if (sourceGroupIndex === -1) return
      
      // Create a complete copy of the moved note with all properties
      const movedNote = JSON.parse(JSON.stringify(newGroups[sourceGroupIndex].notes[source.index]))
      
      // Remove from source group
      newGroups[sourceGroupIndex].notes.splice(source.index, 1)
      
      // Update group references
      movedNote.groupId = null
      movedNote.noteGroupId = null
      
      // Add to standalone
      const newStandaloneNotes = Array.from(standaloneNotes)
      newStandaloneNotes.splice(destination.index, 0, movedNote)
      
      // Update positions
      const sourceNotes = newGroups[sourceGroupIndex].notes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      const updatedStandaloneNotes = newStandaloneNotes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Apply position updates
      newGroups[sourceGroupIndex].notes = sourceNotes
      
      // Create minimal update objects for the backend
      const updates = []
      
      // Add source group updates
      for (const note of sourceNotes) {
        const update = {
          id: note.id,
          position: note.position,
          groupId: newGroups[sourceGroupIndex].id
        }
        updates.push(update)
      }
      
      // Add standalone updates
      for (const note of updatedStandaloneNotes) {
        const update = {
          id: note.id,
          position: note.position,
          groupId: null
        }
        updates.push(update)
      }
      
      // Update backend
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      // Update frontend
      setGroups(newGroups)
      setStandaloneNotes(updatedStandaloneNotes)
      return
    }
    
    // Standalone → Group (move from standalone to group)
    if (source.droppableId === STANDALONE_DROPPABLE_ID && destination.droppableId !== STANDALONE_DROPPABLE_ID) {
      const newGroups = [...groups]
      const destGroupIndex = newGroups.findIndex((group) => group.id === destination.droppableId)
      if (destGroupIndex === -1) return
      
      // Create a complete copy of the moved note with all properties
      const movedNote = JSON.parse(JSON.stringify(standaloneNotes[source.index]))
      
      // Remove from standalone
      const newStandaloneNotes = Array.from(standaloneNotes)
      newStandaloneNotes.splice(source.index, 1)
      
      // Update group references
      movedNote.groupId = newGroups[destGroupIndex].id
      movedNote.noteGroupId = newGroups[destGroupIndex].id
      
      // Add to destination group
      newGroups[destGroupIndex].notes.splice(destination.index, 0, movedNote)
      
      // Update positions
      const updatedStandaloneNotes = newStandaloneNotes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      const destNotes = newGroups[destGroupIndex].notes.map((note, idx) => ({
        ...note,
        position: idx
      }))
      
      // Apply position updates
      newGroups[destGroupIndex].notes = destNotes
      
      // Create minimal update objects for the backend
      const updates = []
      
      // Add destination group updates
      for (const note of destNotes) {
        const update = {
          id: note.id,
          position: note.position,
          groupId: newGroups[destGroupIndex].id
        }
        updates.push(update)
      }
      
      // Add standalone updates
      for (const note of updatedStandaloneNotes) {
        const update = {
          id: note.id,
          position: note.position,
          groupId: null
        }
        updates.push(update)
      }
      
      // Update backend
      await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      // Update frontend
      setGroups(newGroups)
      setStandaloneNotes(updatedStandaloneNotes)
      return
    }
  }, [groups, setGroups, standaloneNotes, setStandaloneNotes, STANDALONE_DROPPABLE_ID])

  return { handleDragEnd }
} 