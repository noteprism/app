import { useState, useEffect } from "react"
import { User, LogOut, Pencil, Mail, Check, CreditCard, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SimpleBadge } from "@/components/ui/simple-badge"

interface ConnectedProviders {
  google: boolean
  linkedin: boolean
  email: boolean
}

interface Subscription {
  plan: string
  status: string | null
  canManageBilling: boolean
  localDevelopment?: boolean
}

interface UserData {
  id: string
  name: string | null
  email: string
  profilePicture: string | null
  connectedProviders: ConnectedProviders
  subscription?: Subscription
}

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editName, setEditName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isTogglingSubscription, setIsTogglingSubscription] = useState(false)
  const router = useRouter()
  const isDevelopment = process.env.NODE_ENV === 'development'

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
  
  // Handle manage subscription
  const handleManageSubscription = () => {
    // Always open Stripe billing portal
    window.open("https://billing.stripe.com/p/login/00w14od5X6Ho0vecWNe3e00", "_blank");
  }
  
  // Handle toggle subscription in development mode
  const handleToggleSubscription = async () => {
    if (!isDevelopment) return;
    
    setIsTogglingSubscription(true);
    try {
      const res = await fetch("/api/dev/toggle-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Refresh user data
        const userRes = await fetch("/api/user");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserData(userData);
        }
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    } finally {
      setIsTogglingSubscription(false);
    }
  };
  
  // Get plan display name
  const getPlanDisplayName = () => {
    if (!userData?.subscription) return "Inactive";
    
    const { plan, status } = userData.subscription;
    
    if (plan === "active" || status === "active") {
      return "Active";
    }
    
    return "Inactive";
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

  // Get list of connected providers
  const getConnectedProviders = () => {
    if (!userData.connectedProviders) return [];
    
    const providers = [];
    if (userData.connectedProviders.google) providers.push("Google");
    if (userData.connectedProviders.linkedin) providers.push("LinkedIn");
    if (userData.connectedProviders.email) providers.push("Email");
    
    return providers;
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Connected:</Label>
              <div className="col-span-3">
                {userData.connectedProviders ? (
                  <div className="text-sm">
                    {[
                      userData.connectedProviders.google ? "Google" : null,
                      userData.connectedProviders.linkedin ? "LinkedIn" : null,
                      userData.connectedProviders.email ? "Email" : null
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No connected accounts</div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Account Type:</Label>
              <div className="col-span-3">
                <div className="text-sm font-medium">
                  {userData.subscription?.plan === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            
            {/* Development mode toggle */}
            {isDevelopment && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Dev Mode:</Label>
                <div className="col-span-3">
                  <Button 
                    variant="outline" 
                    onClick={handleToggleSubscription}
                    disabled={isTogglingSubscription}
                    className="flex items-center"
                  >
                    {userData.subscription?.plan === 'active' ? (
                      <ToggleRight className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="mr-2 h-4 w-4" />
                    )}
                    {isTogglingSubscription ? 'Toggling...' : 'Toggle Subscription'}
                  </Button>
                  <div className="text-xs text-muted-foreground mt-1">
                    Development mode only - toggle subscription status
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleManageSubscription}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
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