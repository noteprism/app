import { Droppable, Draggable } from "@hello-pangea/dnd"
import NoteCard from "@/components/note-card"
import type { Note } from "@/types/notes"

interface NoteGrouplessProps {
  standaloneNotes: Note[]
  onDeleteStandaloneNote: (noteId: string) => void
  onUpdateStandaloneNote: (noteId: string, updated: { content: string, color?: string }) => void
  STANDALONE_DROPPABLE_ID: string
  editingNoteId?: string | null
  setEditingNoteId?: (id: string | null) => void
  cardStyle: "outline" | "filled"
}

export default function NoteGroupless({ standaloneNotes, onDeleteStandaloneNote, onUpdateStandaloneNote, STANDALONE_DROPPABLE_ID, editingNoteId, setEditingNoteId, cardStyle }: NoteGrouplessProps) {
  if (standaloneNotes.length === 0) return null
  return (
    <Droppable droppableId={STANDALONE_DROPPABLE_ID} direction="vertical">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col gap-4 h-full"
        >
          {standaloneNotes.map((note, idx) => (
            <Draggable key={note.id} draggableId={note.id} index={idx}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <NoteCard
                    note={note}
                    onDelete={() => onDeleteStandaloneNote(note.id)}
                    onUpdate={(updated) => {
                      onUpdateStandaloneNote(note.id, updated)
                      if (setEditingNoteId) setEditingNoteId(null)
                    }}
                    isEditing={note.id === editingNoteId}
                    cardStyle={cardStyle}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
} 