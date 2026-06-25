import {
  ref,
  set,
  get,
  onValue,
  remove,
  update,
} from 'firebase/database'
import { database, auth } from './firebase.config'

const getItemsPath = () => {
  const userId = auth.currentUser?.uid
  if (!userId) throw new Error('User not authenticated')
  return `users/${userId}/items`
}

// Listen to items in real-time
export const listenToItems = (callback) => {
  const itemsRef = ref(database, getItemsPath())
  
  const unsubscribe = onValue(
    itemsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const itemsObj = snapshot.val()
        const itemsArray = Object.values(itemsObj)
        callback(itemsArray)
      } else {
        callback([])
      }
    },
    (error) => {
      console.error('Error listening to items:', error)
    }
  )
  
  return unsubscribe
}

// Get items once
export const getItems = async () => {
  const itemsRef = ref(database, getItemsPath())
  const snapshot = await get(itemsRef)
  
  if (snapshot.exists()) {
    const itemsObj = snapshot.val()
    return Object.values(itemsObj)
  }
  return []
}

// Add a new item
export const addItem = async (item) => {
  const itemRef = ref(database, `${getItemsPath()}/${item.id}`)
  await set(itemRef, item)
}

// Update an item
export const updateItem = async (itemId, updates) => {
  const itemRef = ref(database, `${getItemsPath()}/${itemId}`)
  await update(itemRef, updates)
}

// Remove an item
export const removeItem = async (itemId) => {
  const itemRef = ref(database, `${getItemsPath()}/${itemId}`)
  await remove(itemRef)
}

// Clear all items
export const clearAllItems = async () => {
  const itemsRef = ref(database, getItemsPath())
  await set(itemsRef, null)
}
