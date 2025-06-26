"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Plus, Search, Settings, User, StickyNote, Folder, Pencil, PanelLeftIcon, LogIn } from "lucide-react"
import Image from "next/image"
import type { NoteGroup as NoteGroupType } from "@/types/notes"
import React, { useState } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import UserProfile from "@/components/user-profile"
import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { differenceInDays, format } from 'date-fns'

interface PanelLeftProps {
  groups: NoteGroupType[]
  handleCreateGroup: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onNewNote: () => void
  onUpdateGroup: (groupId: string, name: string) => void
  userSubscription?: {
    plan: string | null;
    status: string | null;
    canManageBilling: boolean;
    trialEndsAt: string | null;
    trialEndingSoon: boolean;
  }
  isPublic?: boolean;
}

export default function PanelLeft({
  groups,
  handleCreateGroup,
  searchQuery,
  setSearchQuery,
  onNewNote,
  onUpdateGroup,
  userSubscription,
  isPublic = false,
}: PanelLeftProps) {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { state, isMobile, openMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const mobileActive = isMobile && openMobile;
  const router = useRouter();

  // Calculate days remaining in trial safely
  const getTrialDaysRemaining = () => {
    if (!userSubscription?.trialEndsAt) return 0;
    
    const endDate = new Date(userSubscription.trialEndsAt);
    const now = new Date();
    const days = differenceInDays(endDate, now);
    
    return Math.max(0, days);
  };

  const startEditing = (group: NoteGroupType, e?: React.MouseEvent) => {
    if (isPublic) {
      // In public mode, redirect to connect page instead of editing
      router.push('/connect');
      return;
    }
    
    // Stop propagation to prevent drag behavior when clicking to edit
    if (e) {
      e.stopPropagation();
    }
    
    setEditingGroupId(group.id);
    setEditingName(group.name);
    
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const saveEditing = () => {
    if (editingGroupId && editingName.trim()) {
      onUpdateGroup(editingGroupId, editingName.trim());
    }
    setEditingGroupId(null);
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleCreateGroupClick = () => {
    if (isPublic) {
      router.push('/connect');
      return;
    }
    handleCreateGroup();
  };

  const handleNewNoteClick = () => {
    if (isPublic) {
      router.push('/connect');
      return;
    }
    onNewNote();
  };

  // If on mobile and sidebar is not open, don't render the main panel
  if (isMobile && !openMobile && isCollapsed) {
    return null;
  }
  
  // If the sidebar is collapsed, render just the floating control
  if (isCollapsed && !isMobile) {
    return (
      <div className="floating-header left-side">
        <div className="flex h-8 w-8 items-center justify-center">
          <Image src="/mark.png" alt="Noteprism Logo" width={28} height={28} className="rounded-sm" />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="h-7 w-7 p-0"
        >
          <PanelLeftIcon className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen shrink-0 border-r bg-card text-card-foreground shadow-sm transition-all flex flex-col
        ${isCollapsed && !isMobile ? 'w-14' : 'w-64'}
        ${isMobile ? 'absolute z-40 left-0' : ''}
      `}
      data-state={isCollapsed ? 'collapsed' : 'expanded'}
    >
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center">
              <Image src="/mark.png" alt="Noteprism Logo" width={28} height={28} className="rounded-sm" />
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="h-7 w-7 p-0"
          >
            <PanelLeftIcon className="h-4 w-4" strokeWidth={1.5} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
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
            onClick={handleNewNoteClick}
            aria-label="New Note"
            size="sm"
          >
            <StickyNote className="h-4 w-4 mr-2" strokeWidth={1.5} />
            <span>New Note</span>
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
              onClick={handleCreateGroupClick}
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
                            className={`${snapshot.isDragging ? 'bg-accent rounded-md shadow-lg z-50' : ''} transition-all duration-150 group`}
                          >
                            <div 
                              className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-grab active:cursor-grabbing hover:bg-accent/50"
                              onClick={(e) => {
                                // Only start editing if we're not already editing and it's not a dragHandleProps interaction
                                if (editingGroupId !== group.id) {
                                  // Check if we're not interacting with the dragHandleProps
                                  const isDragInteraction = e.target === e.currentTarget || 
                                    (e.currentTarget as HTMLElement).contains(e.target as HTMLElement);
                                  
                                  if (isDragInteraction) {
                                    startEditing(group, e);
                                  }
                                }
                              }}
                            >
                              {editingGroupId === group.id ? (
                                <Input
                                  ref={inputRef}
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="h-6 text-sm py-0 px-1 w-full"
                                  autoFocus
                                  onBlur={saveEditing}
                                  onKeyDown={handleNameKeyDown}
                                  // These are crucial to prevent drag from happening while editing
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onTouchStart={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <>
                                  <span className="truncate flex-1">{group.name}</span>
                                  <div className="flex items-center">
                                    <span className="text-xs text-muted-foreground">{group.notes.length}</span>
                                  </div>
                                </>
                              )}
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
      
      {/* Trial info */}
      {userSubscription?.status === "trialing" && userSubscription?.trialEndsAt && (
        <div className="px-4 py-2 text-xs">
          Trial: {getTrialDaysRemaining()} days
        </div>
      )}
      
      {/* Footer */}
      <div className="border-t">
        <div className="flex items-center p-4">
          {isPublic ? (
            <Link href="/connect" className="w-full">
              <Button className="w-full" variant="default">
                <LogIn className="h-4 w-4 mr-2" />
                Sign Up / Login
              </Button>
            </Link>
          ) : (
          <UserProfile />
          )}
        </div>
      </div>
    </div>
  )
} 