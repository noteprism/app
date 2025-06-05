export interface Note {
  id: string
  content: string
  color: string
  createdAt: string
  groupId?: string | null
  position?: number
  checkedStates?: boolean[]
}

export interface NoteGroup {
  id: string
  title: string
  notes: Note[]
}
