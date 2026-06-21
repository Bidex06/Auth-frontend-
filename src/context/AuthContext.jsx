import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  status: 'loading', // 'loading' | 'authenticated' | 'unauthenticated'
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTHENTICATED':
      return { user: action.user, status: 'authenticated' }
    case 'UNAUTHENTICATED':
      return { user: null, status: 'unauthenticated' }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // On mount, try to restore the session by calling /refresh.
  // If it works, the httpOnly cookie was still valid and we get a fresh access token.
  useEffect(() => {
    api.post('/auth/refresh')
      .then(res => {
        window.__accessToken = res.data.accessToken
        dispatch({ type: 'AUTHENTICATED', user: res.data.user })
      })
      .catch(() => {
        dispatch({ type: 'UNAUTHENTICATED' })
      })
  }, [])

  // Listen for the axios interceptor signalling the refresh token itself has expired
  useEffect(() => {
    const handle = () => dispatch({ type: 'UNAUTHENTICATED' })
    window.addEventListener('auth:expired', handle)
    return () => window.removeEventListener('auth:expired', handle)
  }, [])

  const login = useCallback((accessToken, user) => {
    window.__accessToken = accessToken
    dispatch({ type: 'AUTHENTICATED', user })
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    window.__accessToken = null
    dispatch({ type: 'UNAUTHENTICATED' })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
