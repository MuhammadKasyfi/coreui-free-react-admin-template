/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)

  const getOAuthToken = async () => {
    const tokenUrl = 'https://localhost:8002/api/oauth2/token'

    const credentials = {
      grant_type: 'password',
      authority: 'builtin',
      username: 'OpticsWEBAPIl4',
      password: 'EmersonProcess#1',
    }

    try {
      const response = await axios.post(tokenUrl, new URLSearchParams(credentials), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const newToken = response.data.access_token
      console.log('Token: ', newToken)

      setToken(newToken)
      return newToken
    } catch (error) {
      // eslint-disable-next-line prettier/prettier
      console.error('Error fetching token: ', error)
      return null
    }
  }

  useEffect(() => {
    getOAuthToken()
  }, [])

  return (
    <AuthContext.Provider value={{ token, refreshToken: getOAuthToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
