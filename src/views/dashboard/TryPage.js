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
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const App = () => {
  const [events, setEvents] = useState([])
  const [eventIndex, setEventIndex] = useState('')
  const [eventData, setEventData] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const addEvent = async () => {
    try {
      const response = await axios.post('http://localhost:3000/events', {
        i: Number(eventIndex),
        e: JSON.parse(eventData),
      })
      setEvents([...events, response.data])
      setEventIndex('')
      setEventData('')
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  return (
    <CContainer>
      <CRow className="my-4">
        <CCol>
          <h1>Event Data Store</h1>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol lg={6}>
          <CCard>
            <CCardHeader>Add Event</CCardHeader>
            <CCardBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Event Index</CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="Event Index"
                      value={eventIndex}
                      onChange={(e) => setEventIndex(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Event Data (JSON format)</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Event Data (JSON format)"
                      value={eventData}
                      onChange={(e) => setEventData(e.target.value)}
                    />
                  </CCol>
                </CRow>
                <CButton color="primary" onClick={addEvent}>
                  Add Event
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Events List</CCardHeader>
            <CCardBody>
              {events.length === 0 ? (
                <CCardText>No events found.</CCardText>
              ) : (
                <CListGroup>
                  {events.map((event) => (
                    <CListGroupItem key={event._id}>
                      <strong>Index:</strong> {event.i} <br />
                      <strong>Data:</strong> {JSON.stringify(event.e)}
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default App
