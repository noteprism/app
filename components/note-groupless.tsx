import { Droppable, Draggable } from "@hello-pangea/dnd"
import NoteCard from "@/components/note-card"
import type { Note } from "@/types/notes"

interface NoteGrouplessProps {
  standaloneNotes: Note[]
  onDeleteStandaloneNote: (noteId: string) => void
  STANDALONE_DROPPABLE_ID: string
}

export default function NoteGroupless({ standaloneNotes, onDeleteStandaloneNote, STANDALONE_DROPPABLE_ID }: NoteGrouplessProps) {
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
                  <NoteCard note={note} onDelete={() => onDeleteStandaloneNote(note.id)} onUpdate={() => {}} />
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