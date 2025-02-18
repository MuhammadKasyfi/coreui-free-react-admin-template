// //csv to json
// import React, { useState, useEffect } from 'react'
// import Papa from 'papaparse'
// import { getOAuthToken } from '../../auth/authToken'
// import axios from 'axios'
// import {
//   CTable,
//   CTableHead,
//   CTableBody,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
// } from '@coreui/react'

// const AssetList = () => {
//   const [data, setData] = useState([])
//   const [demoData, setDemoData] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const savedData = localStorage.getItem('uploadedCSVData')
//     if (savedData){
//       setData(JSON.parse(savedData))
//     }
//   }, [])

//   const getDemoData = async (assetTag, baseIdentifier, locationPath ) => {
//     const baseUrl = 'https://localhost:8002/api/v2/read'
//     const identifier = `/${baseIdentifier}/${locationPath}/${assetTag}`
//     const url = `${baseUrl}?identifier=${identifier}`
//     const param = `identifier=${identifier}`

//     try {
//       const token = await getOAuthToken()
//       const response = await axios.get(`${url}/_healthindex&${param}.Asset.SerialNumber&${param}.Asset.Manufacturer&${param}.Asset.ModelNumber&${param}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       })
//       if (assetTag)
//       // console.log(`Fetched data for ${assetTag}:`, response.data)
//       return response.data.data
//     } catch (error) {
//       console.error(`Error fetching data for ${assetTag}:`, error.response?.data || error.message)
//     }
//   }

//   getDemoData()

//   const fetchDemoData = async () => {
//     setLoading(true)
//     const token = await getOAuthToken()
//     // console.log(token) //to console only 1  token
//     if (!token) {
//       console.error('Failed to retrieve OAuth token.')
//       setLoading(false)
//       return
//     }

//     const allData = []
//     for (const item of data) {
//       const assetTag = item.AssetTag
//       if (assetTag) {
//         const fetchedData = await getDemoData(item.AssetTag, item.BaseIdentifier, item.LocationPath)
//         const healthIndex = fetchedData?.[0]?.v !== undefined && fetchedData?.[0]?.v !== null ? fetchedData[0]?.v : 'N/A'
//         allData.push({ 
//           id: item.id,
//           healthIndex,
//           serialNumber: fetchedData?.[1]?.v || 'N/A',
//           manufacturer: fetchedData?.[2]?.v || 'N/A',
//           modelNumber: fetchedData?.[3]?.v || 'N/A',
//         })
//       }
//     }
//     setDemoData(allData)
//     setLoading(false)
//   }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       Papa.parse(file, {
//         header: true, //convert csv to json
//         skipEmptyLines: true,
//         complete: (result) => {
//           const jsonData = result.data.map((row, index) => ({
//             id: `${index+1}`, //assign id
//             ...row, // include original row data
//           }))
//           setData(jsonData)
//           localStorage.setItem('uploadedCSVData', JSON.stringify(jsonData))
//         },
//       })
//     }
//   }

//   const getCombinedData = () => {
//     return data.map((item) => {
//       const demoItem = demoData.find((demo) => demo.id === item.id)
//       return { 
//         ...item,
//         healthIndex: demoItem?.healthIndex || 'N/A',
//         serialNumber: demoItem?.serialNumber || 'N/A',
//         manufacturer: demoItem?.manufacturer || 'N/A',
//         modelNumber: demoItem?.modelNumber || 'N/A'
//       }
//     })
//   }

//   useEffect(() => {
//     if (data.length > 0) fetchDemoData()
//   }, [data])

//   return (
//     <div>
//       <input type="file" accept=".csv" onChange={handleFileChange} />

//       <h3>Asset List</h3>
//       {loading ? (
//         <p>Loading data...</p>
//       ) : data.length > 0 ? (
//         <CTable striped bordered hover>
//           <CTableHead>
//             <CTableRow>
//               <CTableHeaderCell>ID</CTableHeaderCell>
//               <CTableHeaderCell>Asset Tag</CTableHeaderCell>
//               <CTableHeaderCell>Asset Location</CTableHeaderCell>
//               <CTableHeaderCell>Health Index</CTableHeaderCell>
//               <CTableHeaderCell>Serial Number</CTableHeaderCell>
//               <CTableHeaderCell>Manufacturer</CTableHeaderCell>
//               <CTableHeaderCell>Model Number</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {getCombinedData().map((item) => (
//               <CTableRow key={item.id}>
//                 <CTableDataCell>{item.id}</CTableDataCell>
//                 <CTableDataCell>{item.AssetTag}</CTableDataCell>
//                 <CTableDataCell>{item.AssetLocation}</CTableDataCell>
//                 <CTableDataCell>{item.healthIndex}</CTableDataCell>
//                 <CTableDataCell>{item.serialNumber}</CTableDataCell>
//                 <CTableDataCell>{item.manufacturer}</CTableDataCell>
//                 <CTableDataCell>{item.modelNumber}</CTableDataCell>
//               </CTableRow>
//             ))}
//           </CTableBody>
//         </CTable>
//       ) : (
//         <p>No data available. Please upload a CSV file</p>
//       )}
//     </div>
//   )
// }

// export default AssetList
