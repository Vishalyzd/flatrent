"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Home, Building2, ShoppingCart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { toast } from "sonner"

export function UserProfileButton() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  const getDashboardLink = () => {
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'seller':
        return '/seller/dashboard'
      case 'buyer':
        return '/buyer/dashboard'
      default:
        return '/dashboard'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        {user.role === 'seller' && (
          <DropdownMenuItem onClick={() => router.push('/seller/properties')}>
            <Building2 className="mr-2 h-4 w-4" />
            My Properties
          </DropdownMenuItem>
        )}
        {user.role === 'buyer' && (
          <DropdownMenuItem onClick={() => router.push('/buyer/favorites')}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Favorites
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 