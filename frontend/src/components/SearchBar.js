'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchBar({ onSearch, placeholder = "Search documents..." }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setQuery('')
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            // Real-time search as user types
            onSearch(e.target.value)
          }}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={() => {
                setQuery('')
                onSearch('')
              }}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
