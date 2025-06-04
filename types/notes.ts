export interface Note {
  id: string
  content: string
  color: string
  createdAt: string
}

export interface NoteGroup {
  id: string
  title: string
  notes: Note[]
}
