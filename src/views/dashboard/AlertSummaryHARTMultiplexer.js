// /* eslint-disable prettier/prettier */
// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import GaugeComponent from 'react-gauge-component'
// import { CChartDoughnut } from '@coreui/react-chartjs'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react'

// const AlertSummaryBravo = () => {
//   const [demoData, setDemoData] = useState([])

//   const getOAuthToken = async () => {
//     const tokenUrl = 'https://localhost:8002/api/oauth2/token'

//     const credentials = {
//       grant_type: 'password',
//       authority: 'builtin',
//       username: 'OpticsWEBAPIL4',
//       password: 'EmersonProcess#1',
//     }

//     try {
//       const response = await axios.post(tokenUrl, new URLSearchParams(credentials), {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       })

//       const token = response.data.access_token
//       console.log('Token: ', token)

//       return token
//     } catch (error) {
//       console.error('Error fetchin token: ', error)
//       return null
//     }
//   }
//   const getDemoData = async (token) => {
//     const opticsURL =
//       'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011' // replace LCV-2011 with loop value
//     const identifier =
//       'identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'

//     try {
//       const response = await axios.get(`${opticsURL}/_healthindex`, {
//         // ${item.AssetName}
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       })
//       console.log('Get LCV-2011 health data: ', response.data) // "Get ${item.AssetName} health data"
//       setDemoData(response.data.data || [])
//     } catch (error) {
//       if (error.code === 'ECONNABORTED') {
//         console.error('Request timed out:', error.message)
//       } else {
//         console.error('Error fetching data: ', error.response.data)
//       }
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = await getOAuthToken()
//       if (token) {
//         await getDemoData(token)
//       }
//     }

//     fetchData() //fetch token
//   }, [])

//   return (
//     <>
//       <CCard>
//         <CCardHeader>
//           <h5>Demo Data</h5>
//         </CCardHeader>
//         <CCardBody>
//           {demoData.length > 0 ? (
//             demoData.map((item, index) => (
//               <CRow key={index}>
//                 <CCol>
//                   <h6>Item {index + 1}</h6>
//                   <p>
//                     <strong>ID:</strong> {item.i}
//                   </p>
//                   <p>
//                     <strong>Path:</strong> {item.p}
//                   </p>
//                   <p>
//                     <strong>Quantity:</strong> {item.q}
//                   </p>
//                   <p>
//                     <strong>Timestamp:</strong> {new Date(item.t).toLocaleString()}
//                   </p>
//                   <p>
//                     <strong>Value:</strong> {item.v}
//                   </p>
//                 </CCol>
//               </CRow>
//             ))
//           ) : (
//             <CRow>
//               <CCol>
//                 <p>No demo data available.</p>
//               </CCol>
//             </CRow>
//           )}
//         </CCardBody>
//       </CCard>
//     </>
//   )
// }

// export default AlertSummaryBravo

import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import GaugeComponent from 'react-gauge-component'
import { Pie } from 'react-chartjs-2'
import axios from 'axios'

const Dashboard = () => {
  const [healthIndices, setHealthIndices] = useState({ daily: 0, weekly: 0, monthly: 0 })
  const [alertsByDevice, setAlertsByDevice] = useState([])
  const [alertsByCategory, setAlertsByCategory] = useState([])
  const [alertList, setAlertList] = useState([])

  const fetchData = async () => {
    try {
      // Example: Fetch health indices
      const healthIndexResponse = await axios.get('/api/health-indices')
      setHealthIndices(healthIndexResponse.data)

      // Example: Fetch alerts by device
      const alertsDeviceResponse = await axios.get('/api/alerts-by-device')
      setAlertsByDevice(alertsDeviceResponse.data)

      // Example: Fetch alerts by category
      const alertsCategoryResponse = await axios.get('/api/alerts-by-category')
      setAlertsByCategory(alertsCategoryResponse.data)

      // Example: Fetch alert list
      const alertListResponse = await axios.get('/api/alert-list')
      setAlertList(alertListResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <CContainer>
      <CRow>
        {/* Health Index Gauges */}
        <CCol xs={12} sm={4}>
          <GaugeCard title="DAILY" value={healthIndices.daily} />
        </CCol>
        <CCol xs={12} sm={4}>
          <GaugeCard title="WEEKLY" value={healthIndices.weekly} />
        </CCol>
        <CCol xs={12} sm={4}>
          <GaugeCard title="MONTHLY" value={healthIndices.monthly} />
        </CCol>
      </CRow>

      <CRow>
        {/* Alerts Pie Charts */}
        <CCol xs={12} sm={6}>
          <PieChartCard title="Total Alerts by Devices" data={alertsByDevice} />
        </CCol>
        <CCol xs={12} sm={6}>
          <PieChartCard title="Total Alerts by Category" data={alertsByCategory} />
        </CCol>
      </CRow>

      <CRow>
        {/* Alert List Table */}
        <CCol xs={12}>
          <AlertTable data={alertList} />
        </CCol>
      </CRow>
    </CContainer>
  )
}

const GaugeCard = ({ title, value }) => (
  <CCard>
    <CCardHeader>{title}</CCardHeader>
    <CCardBody>
      <GaugeComponent
        arc={{
          thickness: 8,
          subArcs: [
            { limit: 40, color: '#EA4228' },
            { limit: 70, color: '#F5CD19' },
            { limit: 100, color: '#5BE12C' },
          ],
        }}
        value={value}
      />
    </CCardBody>
  </CCard>
)

const PieChartCard = ({ title, data }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: ['#F58B19', '#EA4228', '#5BE12C'],
      },
    ],
  }

  return (
    <CCard>
      <CCardHeader>{title}</CCardHeader>
      <CCardBody>
        <Pie data={chartData} />
      </CCardBody>
    </CCard>
  )
}

const AlertTable = ({ data }) => (
  <CCard>
    <CCardHeader>Alert Listing</CCardHeader>
    <CCardBody>
      <table className="table">
        <thead>
          <tr>
            <th>TimeStamp</th>
            <th>AMSTag</th>
            <th>Criticality</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Alert</th>
          </tr>
        </thead>
        <tbody>
          {data.map((alert, index) => (
            <tr key={index}>
              <td>{alert.timeStamp}</td>
              <td>{alert.amstag}</td>
              <td>{alert.criticality}</td>
              <td>{alert.manufacturer}</td>
              <td>{alert.model}</td>
              <td>{alert.alert}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CCardBody>
  </CCard>
)

export default Dashboard
