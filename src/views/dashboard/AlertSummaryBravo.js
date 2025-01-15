/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import GaugeComponent from 'react-gauge-component'
import { CChartDoughnut } from '@coreui/react-chartjs'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const AlertSummaryBravo = () => {
  const [demoData, setDemoData] = useState([])

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
      console.error('Error fetchin token: ', error)
      return null
    }
  }
  const getDemoData = async (token) => {
    const opticsURL =
      'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011' // replace LCV-2011 with loop value
    const identifier =
      'identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'

    try {
      const response = await axios.get(`${opticsURL}/_healthindex`, {
        // ${item.AssetName}
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      console.log('Get LCV-2011 health data: ', response.data) // "Get ${item.AssetName} health data"
      setDemoData(response.data.data || [])
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out:', error.message)
      } else {
        console.error('Error fetching data: ', error.response.data)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = await getOAuthToken()
      if (token) {
        await getDemoData(token)
      }
    }

    fetchData() //fetch token
  }, [])

  return (
    <>
      <CCard>
        <CCardHeader>
          <h5>Demo Data</h5>
        </CCardHeader>
        <CCardBody>
          {demoData.length > 0 ? (
            demoData.map((item, index) => (
              <CRow key={index}>
                <CCol>
                  <h6>Item {index + 1}</h6>
                  <p>
                    <strong>ID:</strong> {item.i}
                  </p>
                  <p>
                    <strong>Path:</strong> {item.p}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.q}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {new Date(item.t).toLocaleString()}
                  </p>
                  <p>
                    <strong>Value:</strong> {item.v}
                  </p>
                </CCol>
              </CRow>
            ))
          ) : (
            <CRow>
              <CCol>
                <p>No demo data available.</p>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default AlertSummaryBravo
