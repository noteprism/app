import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Plus, Search, Settings, User, StickyNote, Folder } from "lucide-react"
import Image from "next/image"
import type { NoteGroup as NoteGroupType } from "@/types/notes"
import React from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"

interface PanelLeftProps {
  groups: NoteGroupType[]
  handleCreateGroup: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onNewNote: () => void
}

export default function PanelLeft({
  groups,
  handleCreateGroup,
  searchQuery,
  setSearchQuery,
  onNewNote,
}: PanelLeftProps) {
  return (
    <div className="peer h-screen w-64 shrink-0 border-r bg-card text-card-foreground shadow-sm transition-all data-[state=collapsed]:w-14 flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center px-2 py-3">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <Image src="/mark.png" alt="Noteprism Logo" width={32} height={32} className="rounded-lg" />
            </div>
            <span>Noteprism</span>
          </div>
        </div>
        <div className="px-2 pb-2">
          <Input
            placeholder="Search notes..."
            className="h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search className="h-4 w-4 text-muted-foreground" strokeWidth={1} />}
          />
        </div>
        <div className="px-2 pb-2">
          <Button
            className="w-full"
            onClick={onNewNote}
            aria-label="New Note"
            size="sm"
          >
            <StickyNote className="h-4 w-4 mr-2" strokeWidth={1.5} />
            New Note
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="py-2 flex-1 overflow-y-auto">
        <div>
          <div className="flex justify-between items-center mb-3 px-4">
            <span className="text-xs uppercase font-medium text-muted-foreground">Note Groups</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCreateGroup}
              className="h-5 w-5"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Group</span>
            </Button>
          </div>
          <div>
            <Droppable droppableId="groups-sidebar" type="group">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <ul className="space-y-1 px-2">
                    {groups.map((group, idx) => (
                      <Draggable key={group.id} draggableId={group.id} index={idx}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? 'bg-accent rounded-md shadow-lg z-50' : ''} transition-all duration-150`}
                          >
                            <div className="px-3 py-2 text-sm rounded-md cursor-grab active:cursor-grabbing hover:bg-accent/50">
                              <span>{group.name}</span>
                              <span className="ml-auto text-xs text-muted-foreground float-right">{group.notes.length}</span>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" strokeWidth={1} />
            <span className="text-sm font-medium">User</span>
          </div>
        </div>
      </div>
    </div>
  )
} 