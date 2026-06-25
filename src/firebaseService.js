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
  // Return clean path without leading/trailing slashes
  return `users/${userId}/items`
}

const getValidPath = (path) => {
  // Clean up path: remove double slashes and ensure no leading slash
  return path.replace(/\/+/g, '/').replace(/^\//, '')
}

// Listen to items in real-time
export const listenToItems = (callback) => {
  try {
    const userId = auth.currentUser?.uid
    if (!userId) {
      console.warn('User not authenticated yet, using empty list')
      callback([])
      return () => {}
    }
    
    const itemsPath = getValidPath(getItemsPath())
    const itemsRef = ref(database, itemsPath)
    
    const unsubscribe = onValue(
      itemsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const itemsObj = snapshot.val()
          const itemsArray = Array.isArray(itemsObj) ? itemsObj : Object.values(itemsObj)
          callback(itemsArray)
        } else {
          callback([])
        }
      },
      (error) => {
        console.error('Error listening to items:', error)
        callback([])
      }
    )
    
    return unsubscribe
  } catch (error) {
    console.error('Error in listenToItems:', error)
    callback([])
    return () => {}
  }
}

// Get items once
export const getItems = async () => {
  try {
    const itemsPath = getValidPath(getItemsPath())
    const itemsRef = ref(database, itemsPath)
    const snapshot = await get(itemsRef)
    
    if (snapshot.exists()) {
      const itemsObj = snapshot.val()
      return Array.isArray(itemsObj) ? itemsObj : Object.values(itemsObj)
    }
    return []
  } catch (error) {
    console.error('Error getting items:', error)
    return []
  }
}

// Add a new item
export const addItem = async (item) => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error('User must be authenticated to add items')
    }
    const itemPath = getValidPath(`${getItemsPath()}/${item.id}`)
    const itemRef = ref(database, itemPath)
    await set(itemRef, item)
  } catch (error) {
    console.error('Error adding item:', error)
    throw error
  }
}

// Update an item
export const updateItem = async (itemId, updates) => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error('User must be authenticated to update items')
    }
    const itemPath = getValidPath(`${getItemsPath()}/${itemId}`)
    const itemRef = ref(database, itemPath)
    await update(itemRef, updates)
  } catch (error) {
    console.error('Error updating item:', error)
    throw error
  }
}

// Remove an item
export const removeItem = async (itemId) => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error('User must be authenticated to remove items')
    }
    const itemPath = getValidPath(`${getItemsPath()}/${itemId}`)
    const itemRef = ref(database, itemPath)
    await remove(itemRef)
  } catch (error) {
    console.error('Error removing item:', error)
    throw error
  }
}

// Clear all items
export const clearAllItems = async () => {
  try {
    if (!auth.currentUser?.uid) {
      throw new Error('User must be authenticated to clear items')
    }
    const itemsPath = getValidPath(getItemsPath())
    const itemsRef = ref(database, itemsPath)
    await set(itemsRef, null)
  } catch (error) {
    console.error('Error clearing items:', error)
    throw error
  }
}
