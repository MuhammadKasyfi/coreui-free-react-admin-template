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
//     'Criticality',
//     'Location.Path',
//     'Asset.ModelNumber',
//     'Asset.SerialNumber',
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

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const token = await getOAuthToken()
//         const allDevices = []

//         for (const tag of assetTags.DeltaV) {
//           const deviceData = await fetchDeviceData(tag, token)
//           if (deviceData) {
//             allDevices.push(deviceData)
//           }
//         }

//         setDevices(allDevices)
//       } catch (err) {
//         setError(err)
//       }
//     }

//     fetchDevices()
//   }, [])

//   console.log(devices)

//   const fetchDeviceData = async (tag, token) => {
//     try {
//       const response = await axios.get(
//         `${api}/read?identifier=${initialPath}/DeltaV/HART/${tag}.Asset.Tag`,
//         //&identifier=${initialPath}/DeltaV/HART/${tag}.Asset.Manufacturer
//         //const response2 = await axios.get(`${opticsURL}.Asset.tag&${identifier}.Asset.Manufacturer`, {
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         },
//       )
//       return response.data
//     } catch (error) {
//       console.error('Error fetching device data:', error)
//       return null
//     }
//   }

//   return (
//     <div>
//       {error && <CAlert color="danger">Error: {error.message}</CAlert>}

//       <CCard>
//         <CCardHeader>Device Listing</CCardHeader>
//         <CCardBody>
//           <CTable>
//             <thead>
//               <CTableRow>
//                 <th>Tag</th>
//                 <th>Manufacturer</th>
//                 <th>Model Number</th>
//                 <th>Serial Number</th>
//                 <th>Criticality</th>
//                 <th>Location Path</th>
//               </CTableRow>
//             </thead>
//             <CTableBody>
//               {devices.length > 0 ? (
//                 devices.map((device, index) => (
//                   <CTableRow key={index}>
//                     <CTableDataCell>{device['Asset.Tag']}</CTableDataCell>
//                     <CTableDataCell>{device['Asset.Manufacturer']}</CTableDataCell>
//                     <CTableDataCell>{device['Asset.ModelNumber']}</CTableDataCell>
//                     <CTableDataCell>{device['Asset.SerialNumber']}</CTableDataCell>
//                     <CTableDataCell>{device['Criticality']}</CTableDataCell>
//                     <CTableDataCell>{device['Location.Path']}</CTableDataCell>
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

  const fetchDeviceData = async (tag, token) => {
    const params = [
      'Asset.Tag',
      'Asset.Manufacturer',
      'Asset.ModelNumber',
      'Asset.SerialNumber',
      'Criticality',
      'Location.Path'
    ];
  

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
        const allDevices = []

        for (const tag of assetTags.DeltaV) {
          const deviceData = await fetchDeviceData(tag, token)
          if (deviceData) {
            allDevices.push(deviceData)
          }
        }

        setDevices(allDevices)
      } catch (err) {
        setError(err)
      }
    }

    fetchDevices()
  }, [])

  console.log(devices)

//  const fetchPromises = params.map(param => {
//       return axios.get(
//         `${api}/read?identifier=${initialPath}/DeltaV/HART/${tag}.${param}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         }
//       );
//     });
try{
  const fetchPromises = params.map(param => {
    return axios.get(
      `${api}/read?identifier=${initialPath}/DeltaV/HART/${tag}.${param}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
  });

  const responses = await Promise.all(fetchPromises);

    // Extract data from responses
    const data = responses.map(response => response.data);
    return data; // This will be an array of data for each parameter
  } catch (error) {
    console.error('Error fetching device data:', error);
    return null;
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
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{handleDeviceData(device).tag}</CTableDataCell>
                    <CTableDataCell>{handleDeviceData(device).manufacturer}</CTableDataCell>
                    <CTableDataCell>{handleDeviceData(device).modelNumber}</CTableDataCell>
                    <CTableDataCell>{handleDeviceData(device).serialNumber}</CTableDataCell>
                    <CTableDataCell>{handleDeviceData(device).criticality}</CTableDataCell>
                    <CTableDataCell>{handleDeviceData(device).locationPath}</CTableDataCell>
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
    </div>
  )
}

export default DeviceListingPage
