import { useEffect, useState } from 'react'
import './App.css'
import { initializeAuth } from './firebase.config'
import {
  listenToItems,
  addItem,
  updateItem,
  removeItem as removeItemFromDb,
  clearAllItems,
} from './firebaseService'

const createItemId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function App() {
  const [itemText, setItemText] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editQuantity, setEditQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize Firebase auth and set up real-time sync
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)
        await initializeAuth()
        
        // Listen to items from Firebase in real-time
        const unsubscribe = listenToItems(setItems)
        
        return unsubscribe
      } catch (err) {
        console.error('Failed to initialize app:', err)
        setError('Failed to connect to cloud. Using local storage as fallback.')
        // Fallback to localStorage
        const stored = localStorage.getItem('shopping-list-items')
        if (stored) {
          try {
            setItems(JSON.parse(stored))
          } catch (e) {
            console.error('Failed to parse stored shopping list', e)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    const unsubPromise = initializeApp()
    
    return () => {
      unsubPromise.then((unsub) => unsub?.())
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = itemText.trim()
    const quantity = Number(itemQuantity)
    if (!text || quantity < 1) return

    const newItem = {
      id: createItemId(),
      text,
      quantity,
      bought: false,
    }

    try {
      await addItem(newItem)
      setItemText('')
      setItemQuantity(1)
    } catch (err) {
      console.error('Failed to add item:', err)
      setError('Failed to add item. Please try again.')
    }
  }

  const toggleBought = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    try {
      await updateItem(id, { bought: !item.bought })
    } catch (err) {
      console.error('Failed to update item:', err)
      setError('Failed to update item. Please try again.')
    }
  }

  const removeItem = async (id) => {
    try {
      await removeItemFromDb(id)
      if (editingId === id) {
        setEditingId(null)
        setEditText('')
        setEditQuantity(1)
      }
    } catch (err) {
      console.error('Failed to remove item:', err)
      setError('Failed to remove item. Please try again.')
    }
  }

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all items?')) return

    try {
      await clearAllItems()
      setEditingId(null)
      setEditText('')
      setEditQuantity(1)
    } catch (err) {
      console.error('Failed to clear all items:', err)
      setError('Failed to clear all items. Please try again.')
    }
  }

  const startEditing = (item) => {
    setEditingId(item.id)
    setEditText(item.text)
    setEditQuantity(item.quantity ?? 1)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    const text = editText.trim()
    const quantity = Number(editQuantity)
    if (!text || editingId == null || quantity < 1) return

    try {
      await updateItem(editingId, { text, quantity })
      setEditingId(null)
      setEditText('')
      setEditQuantity(1)
    } catch (err) {
      console.error('Failed to save edit:', err)
      setError('Failed to save edit. Please try again.')
    }
  }

  return (
    <div className="app-container">
      <h1>Shopping List ☁️</h1>
      
      {isLoading && <p className="loading">Loading your shopping list...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!isLoading && (
        <>
          <form onSubmit={handleSubmit} className="add-form">
            <input
              type="text"
              aria-label="New shopping item"
              placeholder="Add a new item"
              value={itemText}
              onChange={(event) => setItemText(event.target.value)}
            />
            <input
              type="number"
              min="1"
              aria-label="Quantity"
              className="quantity-input"
              value={itemQuantity}
              onChange={(event) => setItemQuantity(event.target.value)}
            />
            <button type="submit">Add</button>
          </form>

          {items.length > 0 ? (
            <>
              <div className="list-toolbar">
                <button type="button" className="clear-button" onClick={clearAll}>
                  Clear All
                </button>
              </div>
              <ul className="shopping-list">
                {items.map((item) => (
                  <li key={item.id} className={item.bought ? 'bought' : ''}>
                  {editingId === item.id ? (
                    <form className="edit-form" onSubmit={saveEdit}>
                      <input
                        type="text"
                        aria-label={`Edit ${item.text}`}
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                      />
                      <input
                        type="number"
                        min="1"
                        aria-label="Edit quantity"
                        className="quantity-input"
                        value={editQuantity}
                        onChange={(event) => setEditQuantity(event.target.value)}
                      />
                      <div className="edit-actions">
                        <button type="submit">Save</button>
                        <button type="button" className="cancel-button" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={item.bought}
                          onChange={() => toggleBought(item.id)}
                        />
                        <span>{item.text}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </label>
                      <div className="item-actions">
                        <button type="button" className="edit-button" onClick={() => startEditing(item)}>
                          Edit
                        </button>
                        <button type="button" className="remove-button" onClick={() => removeItem(item.id)}>
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty-state">Your shopping list is empty. Add an item to get started.</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
