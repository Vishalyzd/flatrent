import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './config'
import type {
  User,
  Property,
  Booking,
  Review,
  Message,
  Notification,
} from '@/types/database'

// User operations
export const userService = {
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, authUserId: string) {
    try {
      console.log('Creating user document with ID:', authUserId)
      const docRef = doc(db, 'users', authUserId)
      await setDoc(docRef, {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log('User document created successfully')
      return docRef.id
    } catch (error) {
      console.error('Error creating user document:', error)
      throw error
    }
  },

  async getById(id: string) {
    try {
      console.log('Fetching user document with ID:', id)
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        console.log('User document not found')
        return null
      }
      const userData = { id: docSnap.id, ...docSnap.data() } as User
      console.log('User document fetched successfully')
      return userData
    } catch (error) {
      console.error('Error fetching user document:', error)
      throw error
    }
  },

  async update(id: string, data: Partial<User>) {
    try {
      console.log('Updating user document with ID:', id)
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
      console.log('User document updated successfully')
    } catch (error) {
      console.error('Error updating user document:', error)
      throw error
    }
  },

  async updateFcmToken(id: string, token: string) {
    const docRef = doc(db, 'users', id)
    await updateDoc(docRef, {
      fcmToken: token,
      updatedAt: serverTimestamp(),
    })
  },

  getAll: async (): Promise<User[]> => {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
  },

  async getSellerStats(sellerId: string) {
    try {
      console.log('Fetching seller stats for:', sellerId);
      const propertiesRef = collection(db, 'properties');
      
      // Get all properties for this seller
      const q = query(propertiesRef, where('sellerId', '==', sellerId));
      const querySnapshot = await getDocs(q);
      
      const stats = {
        totalProperties: querySnapshot.size,
        activeListings: 0,
        pendingApprovals: 0
      };

      // Count active and pending properties
      querySnapshot.forEach(doc => {
        const property = doc.data();
        if (property.status === 'active') {
          stats.activeListings++;
        } else if (property.status === 'pending') {
          stats.pendingApprovals++;
        }
      });

      console.log('Seller stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error getting seller stats:', error);
      throw error;
    }
  },
}

// Property operations
export const propertyService = {
  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...property,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async getById(id: string) {
    const docRef = doc(db, 'properties', id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Property : null
  },

  async getBySellerId(sellerId: string) {
    const q = query(collection(db, 'properties'), where('sellerId', '==', sellerId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[]
  },

  async getByStatus(status: Property['status']) {
    const propertiesRef = collection(db, 'properties')
    const q = query(propertiesRef, where('status', '==', status))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[]
  },

  async update(id: string, data: Partial<Property>) {
    const propertyRef = doc(db, 'properties', id)
    await updateDoc(propertyRef, {
      ...data,
      updatedAt: new Date(),
    })
  },

  async delete(id: string) {
    const docRef = doc(db, 'properties', id)
    await deleteDoc(docRef)
  },

  async search(filters: {
    city?: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    guests?: number
    checkIn?: Date
    checkOut?: Date
  }) {
    let q = query(collection(db, 'properties'), where('status', '==', 'active'))

    if (filters.city) {
      q = query(q, where('location.city', '==', filters.city))
    }

    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice))
    }

    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice))
    }

    if (filters.propertyType) {
      q = query(q, where('details.propertyType', '==', filters.propertyType))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[]
  },

  getAll: async (): Promise<Property[]> => {
    const snapshot = await getDocs(collection(db, 'properties'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property))
  },
}

// Booking operations
export const bookingService = {
  async create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async getById(id: string) {
    const docRef = doc(db, 'bookings', id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Booking : null
  },

  async getByBuyerId(buyerId: string) {
    const q = query(collection(db, 'bookings'), where('buyerId', '==', buyerId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[]
  },

  async getBySellerId(sellerId: string) {
    const q = query(collection(db, 'bookings'), where('sellerId', '==', sellerId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[]
  },

  async update(id: string, data: Partial<Booking>) {
    const docRef = doc(db, 'bookings', id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  getAll: async (): Promise<Booking[]> => {
    const snapshot = await getDocs(collection(db, 'bookings'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking))
  },
}

// Review operations
export const reviewService = {
  async create(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async getByPropertyId(propertyId: string) {
    const q = query(
      collection(db, 'reviews'),
      where('propertyId', '==', propertyId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[]
  },
}

// Message operations
export const messageService = {
  async create(message: Omit<Message, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  },

  async getConversation(userId1: string, userId2: string, propertyId?: string) {
    let q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [userId1, userId2]),
      where('receiverId', 'in', [userId1, userId2]),
      orderBy('createdAt', 'asc')
    )

    if (propertyId) {
      q = query(q, where('propertyId', '==', propertyId))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[]
  },

  async markAsRead(messageId: string) {
    const docRef = doc(db, 'messages', messageId)
    await updateDoc(docRef, { read: true })
  },

  getAll: async (): Promise<Message[]> => {
    const snapshot = await getDocs(collection(db, 'messages'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message))
  },
}

// Notification operations
export const notificationService = {
  async create(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      read: false,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  },

  async getByUserId(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Notification[]
  },

  async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, 'notifications', notificationId)
    await updateDoc(docRef, {
      read: true,
    })
  },

  async delete(notificationId: string): Promise<void> {
    const docRef = doc(db, 'notifications', notificationId)
    await deleteDoc(docRef)
  },
}

// Add this function near your other Firestore functions
async function createNotificationsIndex() {
  try {
    const notificationsRef = collection(db, 'notifications');
    
    // Delete dummy doc if it exists
    await deleteDoc(doc(db, 'notifications', '_dummy'));
    
    // Create dummy doc
    await addDoc(notificationsRef, {
      userId: '_dummy',
      createdAt: new Date(),
      message: 'Dummy notification for index creation',
      type: 'dummy'
    });
    
    // Test query that needs the index
    const q = query(
      notificationsRef,
      where('userId', '==', '_dummy'),
      orderBy('createdAt', 'desc')
    );
    await getDocs(q);
    
    console.log('Notifications index created successfully');
  } catch (error: any) {
    if (error?.code === 'failed-precondition') {
      console.log('Please create the index manually using this link:', error.details);
    } else {
      console.error('Error creating notifications index:', error);
    }
  }
}

// Call the function
createNotificationsIndex(); 