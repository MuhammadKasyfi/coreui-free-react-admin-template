import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CAlert,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'

const DeviceListingPage = () => {
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(null)
  const api = 'https://localhost:8002/api/v2'
  const initialPath = 'System/Core/OpticsSource/AMS Device Manager/EPM Subang/Demo Set/HART'

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
      return response.data.access_token
    } catch (error) {
      console.error('Error fetching token: ', error)
      return null
    }
  }

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getOAuthToken()
        const area = ['DeltaV', 'HART Mulitplexer']
        const params = [
          'Asset.Tag',
          'Asset.Manufacturer',
          'Criticality',
          'Location.Path',
          'Asset.ModelNumber',
          'Asset.SerialNumber',
        ]
        const response = await axios.get(
          `${api}/read?identifier=${initialPath}/${area}&params=${params.join(',')}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (Array.isArray(response.data)) {
          setDevices(response.data)
        } else {
          console.error('Expected an array but got: ', response.data)
          setDevices([])
        }
      } catch (err) {
        setError(err)
      }
    }

    fetchDevices()
  }, [api, initialPath])

  return (
    <div>
      {error && <CAlert color="danger">Error: {error.message}</CAlert>}

      <CCard>
        <CCardHeader>Device Listing</CCardHeader>
        <CCardBody>
          <CTable>
            <thead>
              <CTableRow>
                <th>Tag</th>
                <th>Manufacturer</th>
                <th>Model Number</th>
                <th>Serial Number</th>
                <th>Criticality</th>
                <th>Location Path</th>
              </CTableRow>
            </thead>
            <CTableBody>
              {devices.map((device, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{device['Asset.Tag']}</CTableDataCell>
                  <CTableDataCell>{device['Asset.Manufacturer']}</CTableDataCell>
                  <CTableDataCell>{device['Asset.ModelNumber']}</CTableDataCell>
                  <CTableDataCell>{device['Asset.SerialNumber']}</CTableDataCell>
                  <CTableDataCell>{device['Criticality']}</CTableDataCell>
                  <CTableDataCell>{device['Location.Path']}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DeviceListingPage
