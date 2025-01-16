import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOAuthToken, getAuthUsername, getAuthPassword } from '../../../auth/authToken'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CAlert,
  CContainer,
  CRow,
  CCol,
  CCardGroup,
  CCard,
  CCardBody,
} from '@coreui/react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const authUser = async (inputUsername, inputPassword) => {
    // const token = await getOAuthToken()
    const un = await getAuthUsername() // retrieve from token
    // console.log('username is ', un)
    const pw = await getAuthPassword() // retrieve from token
    // console.log('password is ', pw)

    if (inputUsername === un && inputPassword === pw) {
      const token = await getOAuthToken()
      console.log(token)
      navigate('/home')
    } else {
      throw new Error('Invaid username or password')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // const handleLogin = async () => {
    //   setLoading(true)
    // }
    try {
      const token = await authUser(username, password)
      // const data = await login()
      // console.log('Login successful:', username)
      localStorage.setItem('authToken', token) //save token for future use
      localStorage.setItem('username', username)
      // alert('Login successful!')
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      navigate('/home')
    }
  }, [navigate])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h1>Login</h1>
                  {error && <CAlert color="danger">{error}</CAlert>}
                  <CForm onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <CFormLabel htmlFor="username">Username</CFormLabel>
                      <CFormInput
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <CFormLabel htmlFor="password">Password</CFormLabel>
                      <CFormInput
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <CButton type="submit" color="primary" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
