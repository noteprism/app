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
import { PlusCircle, Plus, Search, Settings, User } from "lucide-react"
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
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <div className="px-2 pb-2">
          <Button
            className="w-full prismatic-gradient-btn"
            onClick={onNewNote}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            New Note
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <span>Note Groups</span>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCreateGroup}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Group</span>
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton isActive={activeGroup === group.id} onClick={() => setActiveGroup(group.id)}>
                    <span>{group.title}</span>
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
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">User</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
} 