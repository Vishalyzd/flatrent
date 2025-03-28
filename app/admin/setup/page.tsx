"use client"

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { userService } from '@/lib/firebase/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function AdminSetupPage() {
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const createAdminAccount = async () => {
    try {
      setIsCreating(true)
      const email = 'admin@flatrent.com'
      const password = 'Admin@123'
      const name = 'Admin User'

      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user document in Firestore
      await userService.create({
        email,
        role: 'admin',
        name,
      })

      toast({
        title: 'Success',
        description: 'Admin account created successfully!',
      })
    } catch (error) {
      console.error('Error creating admin account:', error)
      toast({
        title: 'Error',
        description: 'Failed to create admin account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Admin Account Details:</h3>
              <p>Email: admin@flatrent.com</p>
              <p>Password: Admin@123</p>
            </div>
            <Button 
              onClick={createAdminAccount} 
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Admin Account'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 