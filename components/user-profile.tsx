import { useState, useEffect } from "react"
import { User, LogOut, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserData {
  id: string
  name: string | null
  email: string
  profilePicture: string | null
}

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editName, setEditName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/user")
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
          setEditName(data.name || "")
        } else {
          console.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Handle updating user name
  const handleSaveName = async () => {
    if (!editName.trim()) return
    
    setIsSaving(true)
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() })
      })
      
      if (res.ok) {
        const updatedUser = await res.json()
        setUserData(updatedUser)
        setIsOpen(false)
      } else {
        console.error("Failed to update user name")
      }
    } catch (error) {
      console.error("Error updating user name:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle user logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      
      if (res.ok) {
        // Redirect to login page or home page
        router.push("/")
        router.refresh()
      } else {
        console.error("Failed to logout")
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error("Error during logout:", error)
      setIsLoggingOut(false)
    }
  }

  // Generate initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Display loading state or no user data
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" strokeWidth={1} />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    )
  }
  
  if (!userData) {
    return (
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" strokeWidth={1} />
        <span className="text-sm font-medium">Guest</span>
      </div>
    )
  }

  // Render user profile with modal
  return (
    <>
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        <Avatar className="h-6 w-6">
          {userData.profilePicture ? (
            <AvatarImage src={userData.profilePicture} alt={userData.name || "User"} />
          ) : null}
          <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{userData.name || userData.email}</span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                {userData.profilePicture ? (
                  <AvatarImage src={userData.profilePicture} alt={userData.name || "User"} />
                ) : null}
                <AvatarFallback className="text-lg">{getInitials(userData.name)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" value={userData.email} disabled className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Display Name</Label>
              <div className="col-span-3 flex gap-2">
                <Input 
                  id="name" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center gap-2">
            <Button 
              variant="destructive" 
              type="button" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
            
            <div>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsOpen(false)} 
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSaveName}
                disabled={isSaving || !editName.trim()}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 