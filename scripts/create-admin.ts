import { auth } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { userService } from '@/lib/firebase/db'

async function createAdminAccount() {
  try {
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

    console.log('Admin account created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
  } catch (error) {
    console.error('Error creating admin account:', error)
  }
}

createAdminAccount() 