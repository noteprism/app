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
  }, [groups, setGroups, standaloneNotes, setStandaloneNotes, STANDALONE_DROPPABLE_ID])

  return { handleDragEnd }
} 