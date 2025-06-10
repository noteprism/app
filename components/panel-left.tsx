import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Plus, Search, Settings, User, StickyNote, Folder } from "lucide-react"
import Image from "next/image"
import type { NoteGroup as NoteGroupType } from "@/types/notes"
import React from "react"

interface PanelLeftProps {
  groups: NoteGroupType[]
  activeGroup: string | null
  setActiveGroup: (id: string) => void
  handleCreateGroup: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onNewNote: () => void
}

export default function PanelLeft({
  groups,
  activeGroup,
  setActiveGroup,
  handleCreateGroup,
  searchQuery,
  setSearchQuery,
  onNewNote,
}: PanelLeftProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center mb-3 px-4">
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
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton isActive={activeGroup === group.id} onClick={() => setActiveGroup(group.id)}>
                    <span>{group.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{group.notes.length}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" strokeWidth={1} />
            <span className="text-sm font-medium">User</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
} 