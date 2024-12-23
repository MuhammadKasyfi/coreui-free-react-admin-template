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

// const TryPage = () => {
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
//     // const subfolders = ['LCV-2011', 'TT-1010', 'TT-1000'] < -- use list to loop through and save to SQL
//     // FETCH from CSV -> D.ID = [01, 02, 03, 04] OR JSON
//     // LOOP

//     //TODO while loop looping through MYSQL device IDs while (data)
//     try {
//       const response = await axios.get(`${opticsURL}/_healthindex`, { //
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       })
//       console.log('Get LCV-2011 health data: ', response.data)
//       setDemoData(response.data.data || [])

//       const response2 = await axios.get(`${opticsURL}.Asset.tag&${identifier}.Asset.Manufacturer`, {
//         //Comma separated string to customize which fields should be included in the response, by default 'i,p,v,q,t'. Provide 'ALL' to include all fields.
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },

//       })
//       console.log('Get all data: ', response2.data)

//       // Fetch devices in the HART directory
//       const devicesResponse = await axios.get(`${hartURL}.LocationPath`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       })
//       console.log('Get all Devices: ', devicesResponse.data)
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

// export default TryPage

//csv to json
import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
} from '@coreui/react'

const TryPage = () => {
  const [data, setData] = useState([])
  const [demoData, setDemoData] = useState([])
  const [loading, setLoading] = useState(false)

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: true, //convert csv to json
        skipEmptyLines: true,
        complete: (result) => {
          const jsonData = result.data.map((row, index) => ({
            id: `${index}`, //assign id
            healthIndex: null, // Placeholder for fetched health index
            ...row, // Include original row data
          }))
          setData(jsonData)
        },
      })
    }
  }

  const getDemoData = async (token, assetName) => {
    const baseUrl = 'https://localhost:8002/api/v2/read'
    const identifier = `/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/${assetName}`
    const url = `${baseUrl}?identifier=${identifier}`

    try {
      const response = await axios.get(`${url}/_healthindex`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      console.log(`Fetched data for ${assetName}:`, response.data)
      return response.data.data || null
    } catch (error) {
      console.error(`Error fetching data for ${assetName}:`, error.response?.data || error.message)
      return null
    }
  }

  const fetchDemoData = async () => {
    setLoading(true)
    setError('') // Clear previous errors
    const token = await getOAuthToken()
    if (!token) {
      console.error('Failed to retrieve OAuth token.')
      setLoading(false)
      setError('Failed to retrieve OAuth token.')
      return
    }

    const updatedData = await Promise.all(
      data.map(async (item) => {
        const assetName = item.AssetName
        if (assetName) {
          const healthIndex = await getDemoData(token, assetName)
          return { ...item, healthIndex }
        }
        return item
      }),
    )
    setData(updatedData)
    setLoading(false)
  }

  useEffect(() => {
    if (data.length > 0) {
      fetchDemoData()
    }
  }, [data])

  return (
    <div>
      <h2>CSV Uploader</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Asset List</h3>
      {loading ? (
        <CSpinner color="primary" />
      ) : data.length > 0 ? (
        <CTable striped bordered hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Asset Name</CTableHeaderCell>
              <CTableHeaderCell>Asset Location</CTableHeaderCell>
              <CTableHeaderCell>Health Index</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.AssetName}</CTableDataCell>
                <CTableDataCell>{item.AssetLocation}</CTableDataCell>
                <CTableDataCell>
                  {item.healthIndex !== null ? item.healthIndex : 'Fetching...'}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p>No data available. Please upload a CSV file.</p>
      )}
    </div>
  )
}

export default TryPage
