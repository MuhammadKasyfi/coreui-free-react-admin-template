import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'

const API_URL = 'https://localhost:8002/api'
const USERNAME = 'OpticsWEBAPIL4'
const PASSWORD = 'EmersonProcess#1'
const GRANT_TYPE = 'password'
const AUTHORITY = 'builtin'
const PARENT_ID = ['4766cef9-39a7-4e2a-886d-b6efb0262636_EPM Subang_Demo Set_HART Multiplexer_HART'] // Specify the parentId here or dynamically fetch it

const TryPage = () => {
  const [data, setData] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    // Step 1: Authenticate and retrieve the token
    const authenticate = async () => {
      try {
        const response = await fetch(`${API_URL}/oauth2/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: USERNAME,
            password: PASSWORD,
            grant_type: GRANT_TYPE,
            authority: AUTHORITY,
          }),
        })

        const result = await response.json()
        if (result.access_token) {
          setToken(result.access_token)
          fetchData(result.access_token, PARENT_ID)
        } else {
          console.error('Authentication failed')
        }
      } catch (error) {
        console.error('Error during authentication', error)
      }
    }

    authenticate()
  }, [])

  // Step 2: Fetch child data for a given parentId using the token
  const fetchData = async (authToken, parentId) => {
    try {
      const response = await fetch(`${API_URL}/assets/${parentId}/children`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      if (result && result.children) {
        setData(result.children)
      } else {
        console.error('No child data found for the specified parent')
      }
    } catch (error) {
      console.error('Error fetching data', error)
    }
  }

  return (
    <CCard>
      <CCardHeader>Device Listing</CCardHeader>
      <CCardBody>
        <CTable striped hover responsive>
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
            {data.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item['Asset.Tag']}</CTableDataCell>
                <CTableDataCell>{item['Asset.Manufacturer']}</CTableDataCell>
                <CTableDataCell>{item['Asset.ModelNumber']}</CTableDataCell>
                <CTableDataCell>{item['Asset.SerialNumber']}</CTableDataCell>
                <CTableDataCell>{item['Criticality']}</CTableDataCell>
                <CTableDataCell>{item['Location.Path']}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default TryPage
