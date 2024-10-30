import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CAlert,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableCell,
} from '@coreui/react'

const TryPage = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [currentPath, setCurrentPath] = useState('')
  const [params, setParams] = useState([])
  const [devices, setDevices] = useState([]) // Store device list

  const getOAuthToken = async () => {
    const tokenUrl = 'https://localhost:8002/api/oauth2/token'

    const credentials = {
      grant_type: 'password',
      authority: 'builtin',
      username: 'OpticsWEBAPIL4',
      password: 'EmersonProcess#1',
    }

    try {
      const response = await axios.post(tokenUrl, new URLSearchParams(credentials), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const token = response.data.access_token
      console.log('Token: ', token)
      return token
    } catch (error) {
      console.error('Error fetching token: ', error)
      return null
    }
  }

  const api = 'https://localhost:8002/api/v2'
  const initialPath = 'System/Core/OpticsSource/AMS Device Manager/EPM Subang/Demo Set/HART'

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getOAuthToken()
        const response = await axios.get(`${api}/read?identifier=${initialPath}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Assuming the response contains a list of devices under HART
        setDevices(response.data)
      } catch (err) {
        setError(err)
      }
    }

    fetchDevices()
  }, [api, initialPath])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getOAuthToken() // Get the token

        if (!token) {
          throw new Error('Unable to retrieve token')
        }

        const response = await axios.get(
          `${api}/read?identifier=${currentPath}&params=${params.join(',')}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          },
        )

        setData(response.data)
      } catch (err) {
        setError(err)
      }
    }

    if (currentPath) {
      fetchData()
    }
  }, [currentPath, params])

  const handleDeviceClick = (device) => {
    // Set the current path to the selected device's path
    setCurrentPath(`${initialPath}/${device}`)
  }

  const handleParamChange = (newParams) => {
    setParams(newParams)
  }

  return (
    <div>
      {error && <CAlert color="danger">Error: {error.message}</CAlert>}

      <CCard>
        <CCardHeader>Devices</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableBody>
              {devices.map((device, index) => (
                <CTableRow key={index}>
                  <CTableCell>
                    <CButton onClick={() => handleDeviceClick(device)}>{device}</CButton>
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {data && (
        <CCard>
          <CCardHeader>Data for {currentPath}</CCardHeader>
          <CCardBody>
            {Array.isArray(data) ? (
              <CTable>
                <CTableBody>
                  {data.map((item, index) => (
                    <CTableRow key={index}>
                      {Object.values(item).map((value, idx) => (
                        <CTableCell key={idx}>{value}</CTableCell>
                      ))}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
          </CCardBody>
        </CCard>
      )}

      <div style={{ marginTop: '20px' }}>
        <CButton
          color="secondary"
          onClick={() => handleParamChange(['Asset.Tag', 'Asset.Manufacturer'])}
        >
          Select Some Params
        </CButton>
      </div>
    </div>
  )
}

export default TryPage
