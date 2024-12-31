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
} from '@coreui/react'

const TryPage = () => {
  const [data, setData] = useState([]) // CSV data
  const [demoData, setDemoData] = useState([]) // Health index data
  const [loading, setLoading] = useState(false) // Loading state

  // Fetch OAuth token
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return response.data.access_token
    } catch (error) {
      console.error('Error fetching token:', error)
      return null
    }
  }

  // Fetch health index data for a specific asset
  const getDemoData = async (asssetTag, baseIdentifier, locationPath) => {
    const baseUrl = 'https://localhost:8002/api/v2/read'
    const identifier = `/${identifier}/${locationPath}${assetTag}`
    const url = `${baseUrl}?identifier=${identifier}`
    const param = `identifier=${identifier}`

    try {
      const token = await getOAuthToken()
      const response = await axios.get(
        `${url}/_healthindex&${param}.Asset.SerialNumber&${param}.Asset.Manufacturer&${param}.Asset.ModelNumber&${param}.LocationPath&${param}.PhysicalPath`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      // return response.data.data || []
      return response.data.data
    } catch (error) {
      console.error(`Error fetching data for ${assetTag}:`, error.response?.data || error.message)
      // return []
    }
  }

  getDemoData()

  // Fetch demo data for all assets
  const fetchDemoData = async () => {
    setLoading(true)
    const token = await getOAuthToken()

    if (!token) {
      console.error('Failed to retrieve OAuth token.')
      setLoading(false)
      return
    }

    const allData = []
    for (const item of data) {
      if (item.AssetName) {
        const fetchedData = await getDemoData(item.AssetTag, item.BaseIdentifier, item.locationPath)
        const healthIndex =
          fetchedData?.[0]?.v !== undefined && fetchedData?.[0]?.v !== null
            ? fetchedData?.[0]?.v
            : 'N/A'
        allData.push({
          id: item.id,
          healthIndex,
          serialNumber: fetchedData?.[1]?.v || 'N/A',
          manufacturer: fetchedData?.[2]?.v || 'N/A',
          modelNumber: fetchedData?.[3]?.v || 'N/A',
          locationPath: fetchedData?.[4]?.v || 'N/A',
          physicalPath: fetchedData?.[5]?.v || 'N/A',
        })
      }
    }
    setDemoData(allData)
    setLoading(false)
  }

  // Handle CSV file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const jsonData = result.data.map((row, index) => ({ id: `${index}`, ...row }))
          setData(jsonData)
        },
      })
    }
  }

  // Combine demo data with CSV data
  const getCombinedData = () => {
    return data.map((item) => {
      const demoItem = demoData.find((demo) => demo.id === item.id)
      return {
        ...item,
        healthIndex: demoItem?.healthIndex || 'N/A',
        serialNumber: demoItem?.serialNumber || 'N/A',
        manufacturer: demoItem?.manufacturer || 'N/A',
        modelNumber: demoItem?.modelNumber || 'N/A',
        locationPath: demoItem?.locationPath || 'N/A',
        physicalPath: demoItem?.physicalPath || 'N/A',
      }
    })
  }

  useEffect(() => {
    if (data.length > 0) fetchDemoData()
  }, [data])

  return (
    <div>
      <h2>CSV Uploader</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <h3>Asset List</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : data.length > 0 ? (
        <CTable striped bordered hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Asset Name</CTableHeaderCell>
              <CTableHeaderCell>Asset Location</CTableHeaderCell>
              <CTableHeaderCell>Health Index</CTableHeaderCell>
              <CTableHeaderCell>Serial Number</CTableHeaderCell>
              <CTableHeaderCell>Manufacturer</CTableHeaderCell>
              <CTableHeaderCell>Model Number</CTableHeaderCell>
              <CTableHeaderCell>Location Path</CTableHeaderCell>
              <CTableHeaderCell>Physical Path</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {getCombinedData().map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.AssetTag}</CTableDataCell>
                <CTableDataCell>{item.AssetLocation}</CTableDataCell>
                <CTableDataCell>{item.healthIndex}</CTableDataCell>
                <CTableDataCell>{item.serialNumber}</CTableDataCell>
                <CTableDataCell>{item.manufacturer}</CTableDataCell>
                <CTableDataCell>{item.modelNumber}</CTableDataCell>
                <CTableDataCell>{item.locationPath}</CTableDataCell>
                <CTableDataCell>{item.physicalPath}</CTableDataCell>
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
