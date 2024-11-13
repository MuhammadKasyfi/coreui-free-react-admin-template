// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import {
//   CAlert,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CTable,
//   CTableBody,
//   CTableRow,
//   CTableDataCell,
//   CTableHeaderCell,
//   CTableHead,
// } from '@coreui/react'

// const DeviceListingPage = () => {
//   const [devices, setDevices] = useState([])
//   const [error, setError] = useState(null)
//   const api = 'https://localhost:8002/api/v2'
//   const initialPath = 'System/Core/OpticsSource/AMS Device Manager/EPM Subang/Demo Set'

//   const assetTags = {
//     DeltaV: ['PT-1100', 'PT-1107', 'PT-1200', 'PT-1300', 'PT-1404', 'QZT-1008'],
//     HART: ['LCV-2011', 'TT-1000', 'TT-1010'],
//   }

//   const params = [
//     'Asset.Tag',
//     'Asset.Manufacturer',
//     'Asset.ModelNumber',
//     'Asset.SerialNumber',
//     'Criticality',
//     'Location.Path',
//   ]

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
//       return response.data.access_token
//     } catch (error) {
//       console.error('Error fetching token: ', error)
//       return null
//     }
//   }

//   const fetchDeviceData = async (tag, token) => {
//     try {
//       const fetchPromises = params.map((param) =>
//         axios.get(`${api}/read?identifier=${initialPath}/DeltaV/HART/${tag}.${param}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         }),
//       )

//       const responses = await Promise.all(fetchPromises)
//       const data = responses.map((response) => response.data)
//       return data // This will be an array of data for each parameter
//     } catch (error) {
//       console.error('Error fetching device data:', error)
//       return null
//     }
//   }

//   const handleDeviceData = (device) => {
//     return {
//       tag: device['Asset.Tag'],
//       manufacturer: device['Asset.Manufacturer'],
//       modelNumber: device['Asset.ModelNumber'],
//       serialNumber: device['Asset.SerialNumber'],
//       criticality: device['Criticality'],
//       locationPath: device['Location.Path'],
//     }
//   }

//   //make function run every time page loads
//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const token = await getOAuthToken()
//         if (!token) {
//           throw new Error('Failed to retrieve OAuth token')
//         }

//         const allDevices = []

//         for (const tag of assetTags.DeltaV) {
//           const deviceData = await fetchDeviceData(tag, token)
//           if (deviceData) {
//             const formattedDeviceData = deviceData.map((paramData) => handleDeviceData(paramData))
//             allDevices.push(...formattedDeviceData)
//           }
//         }

//         setDevices(allDevices)
//       } catch (err) {
//         setError(err)
//       }
//     }

//     fetchDevices()
//   }, [])

//   return (
//     <div>
//       {error && <CAlert color="danger">Error: {error.message}</CAlert>}

//       <CCard>
//         <CCardHeader>Device Listing</CCardHeader>
//         <CCardBody>
//           <CTable>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>Tag</CTableHeaderCell>
//                 <CTableHeaderCell>Manufacturer</CTableHeaderCell>
//                 <CTableHeaderCell>Model Number</CTableHeaderCell>
//                 <CTableHeaderCell>Serial Number</CTableHeaderCell>
//                 <CTableHeaderCell>Criticality</CTableHeaderCell>
//                 <CTableHeaderCell>Location Path</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {devices.length > 0 ? (
//                 devices.map((device, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{device.tag}</CTableDataCell>
//                     <CTableDataCell>{device.manufacturer}</CTableDataCell>
//                     <CTableDataCell>{device.modelNumber}</CTableDataCell>
//                     <CTableDataCell>{device.serialNumber}</CTableDataCell>
//                     <CTableDataCell>{device.criticality}</CTableDataCell>
//                     <CTableDataCell>{device.locationPath}</CTableDataCell>
//                   </CTableRow>
//                 ))
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="6">No devices found</CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>
//         </CCardBody>
//       </CCard>
//     </div>
//   )
// }

// export default DeviceListingPage

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
  CTableHeaderCell,
  CTableHead,
} from '@coreui/react'

const TryPage = () => {
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(null)
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

  // Recursive function to fetch data from the latest child path
  const fetchLatestChildData = async (currentPath, token, tag) => {
    try {
      const fetchPromises = params.map((param) =>
        axios.get(`${api}/read?identifier=${currentPath}/DeltaV/HART/${tag}.${param}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      )

      const responses = await Promise.all(fetchPromises)
      const data = responses.map((response) => response.data)

      // Check if the current path has children by attempting a recursive fetch
      const nextPath = `${currentPath}/DeltaV/HART/${tag}`
      const hasChildren = data.some((item) => item.children && item.children.length > 0)

      if (hasChildren) {
        return fetchLatestChildData(nextPath, token, tag)
      } else {
        // Return data if it is the last child (no further children)
        return data
      }
    } catch (error) {
      console.error('Error fetching latest child data:', error)
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
      locationPath: device['Location.Path'],
    }
  }

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getOAuthToken()
        if (!token) {
          throw new Error('Failed to retrieve OAuth token')
        }

        const allDevices = []

        for (const tag of assetTags.DeltaV) {
          const deviceData = await fetchLatestChildData(initialPath, token, tag)
          if (deviceData) {
            const formattedDeviceData = deviceData.map((paramData) => handleDeviceData(paramData))
            allDevices.push(...formattedDeviceData)
          }
        }

        setDevices(allDevices)
      } catch (err) {
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
