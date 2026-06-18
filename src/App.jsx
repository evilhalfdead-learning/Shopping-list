import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'shopping-list-items'

function App() {
  const [itemText, setItemText] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editQuantity, setEditQuantity] = useState(1)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse stored shopping list', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = itemText.trim()
    const quantity = Number(itemQuantity)
    if (!text || quantity < 1) return

    setItems((currentItems) => [
      ...currentItems,
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        quantity,
        bought: false,
      },
    ])
    setItemText('')
    setItemQuantity(1)
  }

  const toggleBought = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item,
      ),
    )
  }

  const removeItem = (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditText('')
      setEditQuantity(1)
    }
  }

  const clearAll = () => {
    setItems([])
    setEditingId(null)
    setEditText('')
    setEditQuantity(1)
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

  const saveEdit = (event) => {
    event.preventDefault()
    const text = editText.trim()
    const quantity = Number(editQuantity)
    if (!text || editingId == null || quantity < 1) return

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === editingId ? { ...item, text, quantity } : item,
      ),
    )
    setEditingId(null)
    setEditText('')
    setEditQuantity(1)
  }

  return (
    <div className="app-container">
      <h1>Shopping List</h1>

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
    </div>
  )
}

export default App
