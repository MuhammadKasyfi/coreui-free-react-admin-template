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
      'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'
    const identifier =
      'identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'
    const hartURL =
      'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'
    // const subfolders = ['LCV-2011', 'TT-1010', 'TT-1000']

    //TODO while loop 
    try {
      const response = await axios.get(`https://localhost:8002/api/v2/read?identifier=/Enterprise/Site/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011/_health`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      console.log('Get LCV-2011 health data: ', response.data)
      setDemoData(response.data.data || [])

      const response2 = await axios.get(`${opticsURL}.Asset.tag&${identifier}.Asset.Manufacturer`, {
        //Comma separated string to customize which fields should be included in the response, by default 'i,p,v,q,t'. Provide 'ALL' to include all fields.
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        
      })
      console.log('Get all data: ', response2.data)

      // Fetch devices in the HART directory
      const devicesResponse = await axios.get(`${hartURL}.LocationPath`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      console.log('Get all Devices: ', devicesResponse.data)
      
    ////////////////////

    // const getDevicePathsRecursively = async (token, folderPath) => {
    //     // Fetch the subfolder contents under the specified folderPath (e.g., HART folder)
    //     const devicesResponse = await axios.get(`${hartURL}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         Accept: 'application/json',
    //       },
    //     });
    
    //     // Assuming the response contains data about subfolders or objects
    //     const subfolders = devicesResponse.data.data; // Adjust this based on actual response structure
    
    //     let devicePaths = [];
    
    //     for (const subfolder of subfolders) {
    //       const fullPath = `${folderPath}/${subfolder.objectName}`;  // Assuming `name` field holds subfolder names
    //       if (subfolder.type === 'folder') {
    //         // If it's a folder, recurse into it
    //         const nestedDevicePaths = await getDevicePathsRecursively(token, fullPath);
    //         devicePaths = devicePaths.concat(nestedDevicePaths);
    //       } else if (subfolder.type === 'device') {
    //         // If it's a device, add its path to the list
    //         devicePaths.push(fullPath);
    //       }
    //     }
    
    //     return devicePaths;
    // };
    
    // // Usage
    // const folderPath = 'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART';
    // const devicePaths = await getDevicePathsRecursively(token, folderPath);
    // console.log('Get all Devices: ', devicePaths);

    //   // Assuming devicesResponse.data contains an array of objects under the HART folder
    // if (devicesResponse.data && Array.isArray(devicesResponse.data)) {
    //   // Extract and display the names of the objects in the HART folder
    //   const objectNames = devicesResponse.data.map((device) => device.objectName); // Assuming `objectName` is the key holding the names
    //   console.log('Object names in HART folder: ', objectNames);
      
    //   // Optionally, you could display these names in the UI if you're using React
    //   // setHartObjectNames(objectNames);
    // } else {
    //   console.error('Invalid data format in devicesResponse:', devicesResponse.data);
    // }

      // const allHartData = []
      // for (const subfolder of subfolders) {
      //   const folderResponse = await axios.get(`${opticsURL}/${subfolder}`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       Accept: 'application/json',
      //     },
      //   })
      //   console.log(`Data for ${subfolder}: `, folderResponse.data)
      //   allHartData.push(folderResponse.data.data || []) // Collect data from each folder
      // }

      // Manufacturer: Fish Controls (Asset.Manufacturer property name)
      // Protocol: HART
      // Device Tag: LCV-2011 (retrieve using ../LCV-2011.asset.tag)
      // Device Type: 9 (retrieve using ../LCV-2011.DeviceTypeCode)
      // Serial No.: 9756693 (retrieve using ../LCV-2011.Asset.SerialNumber)
      // Criticality: C1 (retrieve using ../LCV-2011.criticality)
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

  // useEffect(() => {
  //   fetch('C:\Emerson\AMSOptics\site\System\Core\OpticsSource\AMS Device Manager\PSSMY SUBANG\EPM Subang\Demo Set\HART Multiplexer\HART\LCV-2011\_healthindex')
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('No Response');
  //       }
  //       return response.json();
  //     })
  //     .then((jsonData) => {
  //       setData(jsonData);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //       setLoading(false);
  //     });
  // }, [])

  // if (loading) {
  //   return (
  //   <>
  //     <CRow>
  //         <CCol>
  //           <h6>Loading...</h6>
  //         </CCol>
  //     </CRow>
  //   </>)
  // }

  // if (error) {
  //   return (
  //   <>
  //     <CRow>
  //         <CCol>
  //           <h6>Error...</h6>
  //         </CCol>
  //     </CRow>
  //   </>)
  // }

  // return (
  //   <>
  //     <CRow>
  //         <CCol>
  //           <h6>Data</h6>
  //         </CCol>
  //     </CRow>
  //     <CRow>
  //         <CCol>
  //           <h6>
  //             Test
  //             {/* {data && (
  //               <pre>{JSON.stringify(data,null, 2)}</pre>
  //             )} */}
  //           </h6>
  //         </CCol>
  //     </CRow>
  //   </>)
}

// const AlertSummaryBravo = () => {
//     return (
//       <>
//         <CRow>
//            <CCol>
//              <h6>Data</h6>
//            </CCol>
//        </CRow>
//        <CRow>
//            <CCol>
//              <h6>
//                 Test
//                {/* {data && (
//                 <pre>{JSON.stringify(data,null, 2)}</pre>
//               )} */}
//             </h6>
//           </CCol>
//        </CRow>
//       </>
//     )
//   }

// const dummyData = {
//   daily: 98,
//   weekly: 96,
//   monthly: 90,
//   totalAlertsByDevice: [20, 80],
//   totalAlertsByCategory: { warning: 50, advisory: 50 },
//   alertList: [
//     {
//       timestamp: '02/11/2022 3:13:42 AM',
//       tag: 'KJC-PY-5810A_01',
//       criticality: 'C2',
//       manufacturer: 'Fisher Controls International',
//       model: 'DVC6200/DVC6000f',
//       alert: 'Performance Info',
//       period: 'Advisory',
//       description: 'An enumeration specifying the cause of the alert to be reported.',
//     },
//     {
//       timestamp: '02/11/2022 3:14:02 AM',
//       tag: 'KJC-PY-5810A_01',
//       criticality: 'C2',
//       manufacturer: 'Fisher Controls International',
//       model: 'DVC6200/DVC6000f',
//       alert: 'Travel Deviation',
//       period: 'Warning',
//       description: 'An enumeration specifying the cause of the alert to be reported.',
//     },
//   ],
// }

// TODO REFACTOR
// IDEAS: ROW 1 - ALERT SUMMARY
//        ROW 2 - LIST
//        ROW 3 - GAUGE, CHARTS, AND TABLE
//        ROW 4 COL-4 - GAUGE
//        ROW 4 COL-4 - CHART 1 + TABLE
//        ROW 4 COL-4 - CHART 2

// const AlertSummaryBravo = () => {
//   return (
//     <>
//       <CRow>
//         <CCol>
//           <h6>Alert Summary</h6>
//         </CCol>
//       </CRow>
//       <CRow>
//         <CCol xs={12}>
//           <CCard>
//             <CCardBody>
//               <CRow>
//                 <CCol xs={3}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>Platform Summary</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>DCS</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={1}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>FGS</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>SIS</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>TCP2420A</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>TCP2420B</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//               </CRow>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//       <CRow>
//         <CCol className="mt-2">
//           <h6 id="percent" className="card-title mb-0">
//             Percent Good
//           </h6>
//           <GaugeComponent
//             type="semicircle"
//             arc={{
//               width: 0.1,
//               padding: 0.005,
//               cornerRadius: 1,
//               subArcs: [
//                 {
//                   limit: 30,
//                   color: '#EA4228',
//                   showTick: true,
//                   tooltip: { text: 'Too low alert!' },
//                 },
//                 { limit: 60, color: '#F5CD19', showTick: true, tooltip: { text: 'Low alert!' } },
//                 { limit: 90, color: '#5BE12C', showTick: true, tooltip: { text: 'OK alert!' } },
//                 { color: '#F5CD19', tooltip: { text: 'High alert!' } },
//                 { color: '#EA4228', tooltip: { text: 'Too high alert!' } },
//               ],
//             }}
//             pointer={{ color: '#345243', length: 0.8, width: 15 }}
//             labels={{
//               valueLabel: { formatTextValue: (value) => value + '%' },
//               tickLabels: {
//                 type: 'outer',
//                 defaultTickValueConfig: {
//                   formatTextValue: (value) => value + '%',
//                   style: { fontSize: 10 },
//                 },
//                 ticks: [0, 30, 60, 90, 100],
//               },
//             }}
//             value={dummyData.daily}
//             minValue={0}
//             maxValue={100}
//           />
//           <p>Daily: {dummyData.daily}</p>
//         </CCol>
//         <CCol>
//           <CCard>
//             <CCardHeader>Total Alert by Device:</CCardHeader>
//             <CCardBody>
//               <CChartDoughnut
//                 data={{
//                   labels: ['Fieldbus', 'Positioner'],
//                   datasets: [
//                     {
//                       data: dummyData.totalAlertsByDevice,
//                       backgroundColor: ['#000080', '#FFD700'],
//                     },
//                   ],
//                 }}
//               />
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol>
//           <CCard>
//             <CCardHeader>Total Alert by Category:</CCardHeader>
//             <CCardBody>
//               <CChartDoughnut
//                 data={{
//                   labels: ['Warning', 'Advisory'],
//                   datasets: [
//                     {
//                       data: [
//                         dummyData.totalAlertsByCategory.warning,
//                         dummyData.totalAlertsByCategory.advisory,
//                       ],
//                       backgroundColor: ['#FFCE56', '#36A2EB'],
//                     },
//                   ],
//                 }}
//               />
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//       <CRow>
//         <CCol>
//           <CCard>
//             <CCardHeader>Alert Listing</CCardHeader>
//             <CCardBody>
//               <CTable>
//                 <CTableHead>
//                   {/* Try display data here */}
//                   <CTableRow>
//                     <CTableHeaderCell>Timestamp</CTableHeaderCell>
//                     <CTableHeaderCell>AMSTag</CTableHeaderCell>
//                     <CTableHeaderCell>Criticality</CTableHeaderCell>
//                     <CTableHeaderCell>Manufacturer</CTableHeaderCell>
//                     <CTableHeaderCell>Model</CTableHeaderCell>
//                     <CTableHeaderCell>Alert</CTableHeaderCell>
//                     <CTableHeaderCell>Period</CTableHeaderCell>
//                     <CTableHeaderCell>Alert Description</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {dummyData.alertList.map((alert, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{alert.timestamp}</CTableDataCell>
//                       <CTableDataCell>{alert.tag}</CTableDataCell>
//                       <CTableDataCell>{alert.criticality}</CTableDataCell>
//                       <CTableDataCell>{alert.manufacturer}</CTableDataCell>
//                       <CTableDataCell>{alert.model}</CTableDataCell>
//                       <CTableDataCell>{alert.alert}</CTableDataCell>
//                       <CTableDataCell>{alert.period}</CTableDataCell>
//                       <CTableDataCell>{alert.description}</CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </>
//   )
// }

export default AlertSummaryBravo
