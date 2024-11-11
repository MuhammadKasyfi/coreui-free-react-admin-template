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
  const initialPath = 'System/Core/OpticsSource/AMS Device Manager/EPM Subang/Demo Set'

  const assetTags = {
    DeltaV: ['PT-1100', 'PT-1107', 'PT-1200', 'PT-1300', 'PT-1404', 'QZT-1008'],
    HART: ['LCV-2011', 'TT-1000', 'TT-1010'],
  }

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
        const params = [
          'Asset.Tag',
          'Asset.Manufacturer',
          'Criticality',
          'Location.Path',
          'Asset.ModelNumber',
          'Asset.SerialNumber',
        ]
        const allDevices = []

        // Fetch data for DeltaV asset tags
        for (const tag of assetTags.DeltaV) {
          const response = await axios.get(
            `${api}/read?identifier=${initialPath}/DeltaV/HART/${tag}&params=${params.join(',')}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          if (Array.isArray(response.data)) {
            allDevices.push(...response.data)
          }
        }

        // Fetch data for HART Multiplexer asset tags
        for (const tag of assetTags.HART) {
          const response = await axios.get(
            `${api}/read?identifier=${initialPath}/HART Multiplexer/HART/${tag}&params=${params.join(',')}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          if (Array.isArray(response.data)) {
            allDevices.push(...response.data)
          }
        }

        setDevices(allDevices)
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
