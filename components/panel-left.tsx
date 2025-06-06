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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface PanelLeftProps {
  groups: NoteGroupType[]
  activeGroup: string | null
  setActiveGroup: (id: string) => void
  handleCreateGroup: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onNewNote: () => void
  cardStyle: "outline" | "filled"
  setCardStyle: (style: "outline" | "filled") => void
}

export default function PanelLeft({
  groups,
  activeGroup,
  setActiveGroup,
  handleCreateGroup,
  searchQuery,
  setSearchQuery,
  onNewNote,
  cardStyle,
  setCardStyle,
}: PanelLeftProps) {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <svg width="0" height="0" className="prismatic-gradient-icon-defs">
          <defs>
            <linearGradient id="prismatic-gradient-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5">
                <animate attributeName="stop-color" values="#4f46e5;#06b6d4;#ec4899;#4f46e5" dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#06b6d4">
                <animate attributeName="stop-color" values="#06b6d4;#ec4899;#4f46e5;#06b6d4" dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#ec4899">
                <animate attributeName="stop-color" values="#ec4899;#4f46e5;#06b6d4;#ec4899" dur="8s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
        </svg>
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
            className="w-full prismatic-gradient-btn flex items-center justify-center"
            onClick={onNewNote}
            aria-label="New Note"
          >
            <StickyNote className="h-5 w-5" strokeWidth={1} />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center mb-3">
            <button
              onClick={handleCreateGroup}
              className="w-full prismatic-gradient-outline-btn flex items-center justify-center h-9 rounded-full bg-white border border-transparent relative overflow-hidden transition-shadow transition-transform duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:shadow-lg focus:-translate-y-0.5"
              style={{ minHeight: '36px', minWidth: '36px' }}
              aria-label="Add Group"
            >
              <span className="absolute inset-0 rounded-full pointer-events-none prismatic-outline" />
              <Folder className="h-5 w-5 stroke-1 relative z-10 prismatic-gradient-icon" strokeWidth={1} />
            </button>
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
            <User className="h-5 w-5" strokeWidth={1} />
            <span className="text-sm font-medium">User</span>
          </div>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" strokeWidth={1} />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-between py-2">
                <span>Filled note style</span>
                <Switch checked={cardStyle === "filled"} onCheckedChange={v => setCardStyle(v ? "filled" : "outline")} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
} 