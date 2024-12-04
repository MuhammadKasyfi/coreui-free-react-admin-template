/*import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
} from '@coreui/react'

const TryPage = () => {
  const [devices, setDevices] = useState([])
  //const [error, setError] = useState(null)
  const api = 'https://localhost:8002/api/v2'
  const initialPath = 'System/Core/OpticsSource/AMS Device Manager/EPM Subang/Demo Set'

  const assetTags = {
    DeltaV: ['PT-1100', 'PT-1107', 'PT-1200', 'PT-1300', 'PT-1404', 'QZT-1008'],
    HART: ['LCV-2011', 'TT-1000', 'TT-1010'],
  }

  const params = [
    'Asset.Tag',
    'Asset.Manufacturer',
    'Asset.ModelNumber',
    'Asset.SerialNumber',
    'Criticality',
    'Location.Path',
  ]

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

  const fetchDeviceData = async (tag, token) => {
    try {
      const queryParams = params
        .map(
          (param) =>
            `identifier=${encodeURIComponent(`${initialPath}/DeltaV/HART/${tag}.${param}`)}`,
        )
        .join('&')

      const url = `${api}/read?${queryParams}`

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      console.log('API Response:', response.data) // Debugging

      return response.data.devices || [] // Make sure it's always an array
    } catch (error) {
      console.error(`Error fetching data for tag ${tag}:`, error)
      return null
    }
  }

  const handleDeviceData = (device) => {
    return {
      tag: device['Asset.Tag'],
      manufacturer: device['Asset.Manufacturer'],
      modelNumber: device['Asset.ModelNumber'],
      serialNumber: device['Asset.SerialNumber'],
      criticality: device['Criticality'],
      locationPath: device['LocationPath'],
    }
  }

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getOAuthToken()
        if (!token) {
          throw new Error('Failed to retrieve OAuth token')
        }

        const allDevices = []

        for (const tag of assetTags.DeltaV) {
          const deviceData = await fetchDeviceData(tag, token)
          console.log('Fetched Device Data:', deviceData) // Debugging
          if (Array.isArray(deviceData)) {
            const formattedDeviceData = deviceData.map((paramData) => handleDeviceData(paramData))
            allDevices.push(...formattedDeviceData)
          } else {
            console.warn(`deviceData is not an array for tag ${tag}`, deviceData)
          }
        }

        console.log('All Devices:', allDevices) // Debugging
        setDevices(allDevices)
      } catch (err) {
        console.error(err)
        setError(err)
      }
    }

    fetchDevices()
  }, [])

  return (
    <CCard>
      <CCardHeader>Device Listing</CCardHeader>
      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Tag</CTableHeaderCell>
              <CTableHeaderCell>Manufacturer</CTableHeaderCell>
              <CTableHeaderCell>Model Number</CTableHeaderCell>
              <CTableHeaderCell>Serial Number</CTableHeaderCell>
              <CTableHeaderCell>Criticality</CTableHeaderCell>
              <CTableHeaderCell>Location Path</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{device.tag}</CTableDataCell>
                  <CTableDataCell>{device.manufacturer}</CTableDataCell>
                  <CTableDataCell>{device.modelNumber}</CTableDataCell>
                  <CTableDataCell>{device.serialNumber}</CTableDataCell>
                  <CTableDataCell>{device.criticality}</CTableDataCell>
                  <CTableDataCell>{device.locationPath}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="6">No devices found</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default TryPage
*/

// Frontend: React.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from '@coreui/react'

const TryPage = () => {
  const [collectionData, setCollectionData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollectionData()
  }, [])

  const fetchCollectionData = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/v2') // Replace with your API endpoint
      setCollectionData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching collection data:', error)
      setLoading(false)
    }
  }

  return (
    <CContainer>
      <CRow className="my-4">
        <CCol>
          <h1>Collection Data</h1>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Data List</CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : collectionData.length === 0 ? (
                <p>No data available in the collection.</p>
              ) : (
                <CTable hover bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      {/* Add your table headers based on collection fields */}
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Field 1</CTableHeaderCell>
                      <CTableHeaderCell>Field 2</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {collectionData.map((item, index) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{item._id}</CTableDataCell>
                        <CTableDataCell>{item.field1}</CTableDataCell>
                        <CTableDataCell>{item.field2}</CTableDataCell>
                        <CTableDataCell>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => alert(`Viewing ${item._id}`)}
                          >
                            View
                          </button>{' '}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => alert(`Deleting ${item._id}`)}
                          >
                            Delete
                          </button>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default TryPage
