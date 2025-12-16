import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

///// Tipos de acciones
export const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTERS: 'SET_FILTERS',
  SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
  ADD_TO_RECENT: 'ADD_TO_RECENT',
  CLEAR_RECENT: 'CLEAR_RECENT',
  SET_RECENT_SEARCHES: 'SET_RECENT_SEARCHES',
  ADD_TO_RECENTLY_VIEWED: 'ADD_TO_RECENTLY_VIEWED'
}

///// Estado inicial
const initialState = {
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    sortBy: 'nombre_asc'
  },
  userPreferences: {
    theme: 'light',
    language: 'es',
    currency: 'ARS'
  },
  recentSearches: [],
  recentlyViewed: [],
  notifications: []
}

///// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case APP_ACTIONS.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      }
    
    case APP_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      }
    
    case APP_ACTIONS.SET_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        }
      }
    
    case APP_ACTIONS.ADD_TO_RECENT:
      const newRecent = [action.payload, ...state.recentSearches.filter(item => item !== action.payload)].slice(0, 5)
      return {
        ...state,
        recentSearches: newRecent
      }
    
    case APP_ACTIONS.CLEAR_RECENT:
      return {
        ...state,
        recentSearches: []
      }
    
    case APP_ACTIONS.SET_RECENT_SEARCHES:
      return {
        ...state,
        recentSearches: action.payload
      }
    
    case APP_ACTIONS.ADD_TO_RECENTLY_VIEWED:
      const newRecentlyViewed = [action.payload, ...state.recentlyViewed.filter(item => item.id !== action.payload.id)].slice(0, 10)
      return {
        ...state,
        recentlyViewed: newRecentlyViewed
      }
    
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  ///// Cargar preferencias del usuario desde localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('app-preferences')
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences)
        dispatch({
          type: APP_ACTIONS.SET_USER_PREFERENCES,
          payload: preferences
        })
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }

    const savedRecent = localStorage.getItem('recent-searches')
    if (savedRecent) {
      try {
        const recent = JSON.parse(savedRecent)
        dispatch({
          type: APP_ACTIONS.SET_RECENT_SEARCHES,
          payload: recent
        })
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }

    const savedRecentlyViewed = localStorage.getItem('recently-viewed')
    if (savedRecentlyViewed) {
      try {
        const recentlyViewed = JSON.parse(savedRecentlyViewed)
        ///// No dispatch aquí, solo cargar en estado inicial si es necesario
      } catch (error) {
        console.error('Error loading recently viewed:', error)
      }
    }
  }, [])

  ///// Guardar preferencias en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('app-preferences', JSON.stringify(state.userPreferences))
  }, [state.userPreferences])

  ///// Guardar búsquedas recientes
  useEffect(() => {
    localStorage.setItem('recent-searches', JSON.stringify(state.recentSearches))
  }, [state.recentSearches])

  ///// Guardar productos vistos recientemente
  useEffect(() => {
    localStorage.setItem('recently-viewed', JSON.stringify(state.recentlyViewed))
  }, [state.recentlyViewed])

  ///// Actions
  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading })
  }

  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error })
  }

  const setSearchTerm = (searchTerm) => {
    dispatch({ type: APP_ACTIONS.SET_SEARCH_TERM, payload: searchTerm })
  }

  const setFilters = (filters) => {
    dispatch({ type: APP_ACTIONS.SET_FILTERS, payload: filters })
  }

  const setUserPreferences = (preferences) => {
    dispatch({ type: APP_ACTIONS.SET_USER_PREFERENCES, payload: preferences })
  }

  const addToRecentSearches = (searchTerm) => {
    if (searchTerm.trim()) {
      dispatch({ type: APP_ACTIONS.ADD_TO_RECENT, payload: searchTerm })
    }
  }

  const clearRecentSearches = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_RECENT })
  }

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: null })
  }

  const addToRecentlyViewed = (product) => {
    if (product && product.id) {
      dispatch({ type: APP_ACTIONS.ADD_TO_RECENTLY_VIEWED, payload: product })
    }
  }

  const value = {
    ///// State
    ...state,
    
    ///// Actions
    setLoading,
    setError,
    clearError,
    setSearchTerm,
    setFilters,
    setUserPreferences,
    addToRecentSearches,
    clearRecentSearches,
    addToRecentlyViewed
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
