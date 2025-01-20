// import React, { useState, useEffect } from 'react'
// import { CCard, CCardBody, CCol, CCardHeader, CRow, CFormSelect } from '@coreui/react'
// import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'

// const DevicePopulation = () => {
//   const [deviceType, setDeviceType] = useState('Fieldbus')

//   // Uncomment the following useState hooks to manage fetched data
//   // const [deviceData, setDeviceData] = useState([]);
//   // const [manufacturerData, setManufacturerData] = useState([]);

//   // Function to handle device type change
//   const handleDeviceTypeChange = (e) => {
//     setDeviceType(e.target.value)
//   }

//   // UseEffect to fetch data from AMS Data Studio (Uncomment when connecting)
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await fetch('AMS_DATA_API_URL'); // Replace with AMS Data API URL
//   //       const data = await response.json();
//   //
//   //       // Assuming data format includes device and manufacturer counts
//   //       setDeviceData(data.deviceCounts);
//   //       setManufacturerData(data.manufacturerCounts);
//   //     } catch (error) {
//   //       console.error('Error fetching data:', error);
//   //     }
//   //   };
//   //
//   //   fetchData();
//   // }, []);

//   return (
//     <CRow>
//       {/* Device Types Dropdown */}
//       <CCol xs={12} className="mb-3">
//         <CCardHeader>
//           <strong>Device Type</strong>
//         </CCardHeader>
//         <CFormSelect aria-label="Device Types" onChange={handleDeviceTypeChange}>
//           <option value="All">All</option>
//           <option value="Fieldbus">Fieldbus</option>
//           <option value="Hart-DCS">Hart-DCS</option>
//           <option value="Hart-FGS">Hart-FGS</option>
//           <option value="Hart-SDS">Hart-SDS</option>
//           <option value="Positioner">Positioner</option>
//           <option value="Wireless">Wireless</option>
//         </CFormSelect>
//       </CCol>

//       {/* Stacked Bar Chart: Device Count by Device Type */}
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>Device Count by Device Type (KNPGB, KNJTC)</CCardHeader>
//           <CCardBody>
//             <CChartBar
//               data={{
//                 labels: ['KNPGB', 'KNJTC'], // Y-axis labels
//                 datasets: [
//                   {
//                     label: '3051 Wireless Pressure Transmitter',
//                     backgroundColor: '#FF6384',
//                     data: [150, 180], // Dummy data
//                   },
//                   {
//                     label: '5300 Radar Level Transmitter',
//                     backgroundColor: '#36A2EB',
//                     data: [120, 150],
//                   },
//                   {
//                     label: '8800D Vortex Flow Transmitter',
//                     backgroundColor: '#FFCE56',
//                     data: [90, 120],
//                   },
//                   {
//                     label: '702 Wireless Discrete',
//                     backgroundColor: '#4BC0C0',
//                     data: [80, 90],
//                   },
//                   {
//                     label: '3144 Fieldbus Temperature',
//                     backgroundColor: '#E7E9ED',
//                     data: [70, 80],
//                   },
//                 ],
//               }}
//               options={{
//                 indexAxis: 'y', // Horizontal stacked bar
//                 scales: {
//                   x: {
//                     stacked: true,
//                     beginAtZero: true,
//                   },
//                   y: {
//                     stacked: true,
//                   },
//                 },
//               }}
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>

//       {/* Stacked Bar Chart: Device Count by Manufacturer */}
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>Device Count by Manufacturer (KNPGB, KNJTC)</CCardHeader>
//           <CCardBody>
//             <CChartBar
//               data={{
//                 labels: ['KNPGB', 'KNJTC'], // Y-axis labels
//                 datasets: [
//                   {
//                     label: 'Rosemount',
//                     backgroundColor: '#FF6384',
//                     data: [500, 550], // Dummy data
//                   },
//                   {
//                     label: 'Siemens',
//                     backgroundColor: '#36A2EB',
//                     data: [300, 320],
//                   },
//                   {
//                     label: 'Yokogawa',
//                     backgroundColor: '#FFCE56',
//                     data: [200, 210],
//                   },
//                   {
//                     label: 'MTL',
//                     backgroundColor: '#4BC0C0',
//                     data: [100, 110],
//                   },
//                   {
//                     label: 'GE Sensing',
//                     backgroundColor: '#E7E9ED',
//                     data: [50, 60],
//                   },
//                 ],
//               }}
//               options={{
//                 indexAxis: 'y', // Horizontal stacked bar
//                 scales: {
//                   x: {
//                     stacked: true,
//                     beginAtZero: true,
//                   },
//                   y: {
//                     stacked: true,
//                   },
//                 },
//               }}
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>

//       {/* Doughnut Chart: Count by Device Types */}
//       <CCol xs={6}>
//         <CCard className="mb-4">
//           <CCardHeader>Count by Device Types</CCardHeader>
//           <CCardBody>
//             <CChartDoughnut
//               data={{
//                 labels: [
//                   '3051 Wireless Pressure Transmitter',
//                   '5300 Radar Level Transmitter',
//                   '8800D Vortex Flow Transmitter',
//                   '702 Wireless Discrete',
//                   '3144 Fieldbus Temperature',
//                 ],
//                 datasets: [
//                   {
//                     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#E7E9ED'],
//                     data: [180, 150, 120, 90, 80], // Dummy data
//                   },
//                 ],
//               }}
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>

//       {/* Doughnut Chart: Count by Manufacturer */}
//       <CCol xs={6}>
//         <CCard className="mb-4">
//           <CCardHeader>Count by Manufacturer</CCardHeader>
//           <CCardBody>
//             <CChartDoughnut
//               data={{
//                 labels: ['Rosemount', 'Siemens', 'Yokogawa', 'MTL', 'GE Sensing'],
//                 datasets: [
//                   {
//                     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#E7E9ED'],
//                     data: [500, 300, 200, 100, 50], // Dummy data
//                   },
//                 ],
//               }}
//             />
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default DevicePopulation

import React, { useEffect, useState } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import { getOAuthToken } from '../../auth/authToken'
import axios from 'axios'

const DevicePopulation = () => {
  const [dataLocation, setDataLocation] = useState(null)
  const [dataManufacturer, setDataManufacturer] = useState(null)
  const [totalAssets, setTotalAssets] = useState(0)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]) // Store uploaded CSV data
  const [demoData, setDemoData] = useState([]) // Store demo data fetched via API

  // Fetch demo data based on asset tag and other parameters
  const getDemoData = async (assetTag, baseIdentifier, locationPath, isa95Path) => {
    const baseUrl = 'https://localhost:8002/api/v2/read'
    const identifier = `/${baseIdentifier}/${locationPath}/${assetTag}`
    const isaIdentifier = `/${isa95Path}/${assetTag}`
    const url = `${baseUrl}?identifier=${identifier}`
    const param = `identifier=${identifier}`
    const param2 = `identifier=${isaIdentifier}`

    try {
      const token = await getOAuthToken()
      const response = await axios.get(
        `${url}/_healthindex&${param}.Asset.SerialNumber&${param}.Asset.Manufacturer&${param}.Asset.ModelNumber&${param2}.DeviceRevision&${param2}.HARTProtocolRevision&${param}.Criticality&${param2}.Interface`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      return response.data.data
    } catch (error) {
      console.error(`Error fetching data for ${assetTag}:`, error.response?.data || error.message)
    }
  }

  // Handle CSV file upload and parse it
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const jsonData = result.data.map((row, index) => ({
            id: `${index + 1}`,
            ...row,
          }))
          setData(jsonData)
          localStorage.setItem('uploadedCSVData', JSON.stringify(jsonData)) // Save data to localStorage
        },
      })
    }
  }

  // Convert the interface value to human-readable format
  const getInterfaceLabel = (interfaceValue) => {
    switch (interfaceValue) {
      case '0':
        return 'None'
      case '1':
        return 'Hart'
      case '2':
        return 'FF'
      case '3':
        return 'Profibus DP'
      case '4':
        return 'Profibus PA'
      default:
        return 'Unknown'
    }
  }

  const getFormattedTime = (time) => {
    if (time === 'N/A') return time
    const date = new Date(time)
    return date.toLocaleString()  // Format to a readable string
  }
  
  // Combine CSV data with demo data
  const getCombinedData = () => {
    return data.map((item) => {
      const demoItem = demoData.find((demo) => demo.id === item.id)
      return {
        ...item,
        healthIndex: demoItem?.healthIndex || 'N/A',
        serialNumber: demoItem?.serialNumber || 'N/A',
        manufacturer: demoItem?.manufacturer || 'N/A',
        modelNumber: demoItem?.modelNumber || 'N/A',
        deviceRevision: demoItem?.deviceRevision || 'N/A',
        hartProtocolRevision: demoItem?.hartProtocolRevision || 'N/A',
        interface: getInterfaceLabel(demoItem?.interface),
        criticality: demoItem?.criticality || 'N/A',
        time: getFormattedTime(demoItem?.time),
      }
    })
  }

  // Fetch demo data and merge it with CSV data
  const fetchDemoData = async () => {
    setLoading(true)
    const allData = []

    for (const item of data) {
      const assetTag = item.AssetTag
      if (assetTag) {
        const fetchedData = await getDemoData(
          item.AssetTag,
          item.BaseIdentifier,
          item.LocationPath,
          item.ISA95Path,
        )
        const healthIndex =
          fetchedData?.[0]?.v !== undefined && fetchedData?.[0]?.v !== null
            ? fetchedData[0]?.v
            : 'N/A'
        const time = fetchedData?.[0]?.t || 'N/A'
        allData.push({
          id: item.id,
          healthIndex,
          serialNumber: fetchedData?.[1]?.v || 'N/A',
          manufacturer: fetchedData?.[2]?.v || 'N/A',
          modelNumber: fetchedData?.[3]?.v || 'N/A',
          deviceRevision: fetchedData?.[4]?.v || 'N/A',
          hartProtocolRevision: fetchedData?.[5]?.v || 'N/A',
          interface: fetchedData?.[6]?.v || 'N/A',
          criticality: fetchedData?.[7]?.v || 'N/A',
          time,
        })
      }
    }
    setDemoData(allData)
    setLoading(false)
  }

  // Handle the logic for bar chart and legend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const token = await getOAuthToken()
        if (!token) {
          console.error('Failed to retrieve OAuth token.')
          setLoading(false)
          return
        }

        const csvData = localStorage.getItem('uploadedCSVData')
        if (!csvData) {
          alert('No data found')
          setLoading(false)
          return
        }

        const parsedData = JSON.parse(csvData)
        const locationCounts = {}
        const manufacturerCounts = {}
        let total = 0

        const manufacturerPromises = parsedData.map(async (row) => {
          const location = row['AssetLocation']
          if (location) {
            locationCounts[location] = (locationCounts[location] || 0) + 1
            total += 1
          }

          const fetchedData = await getDemoData(row.AssetTag, row.BaseIdentifier, row.LocationPath)
          const manufacturer = fetchedData?.[2]?.v || 'N/A' // Assuming manufacturer is at index 2 and property 'v'
          if (manufacturer) {
            manufacturerCounts[manufacturer] = (manufacturerCounts[manufacturer] || 0) + 1
          }
        })

        await Promise.all(manufacturerPromises)

        // Set the state with processed data for charts
        setDataLocation({
          labels: Object.keys(locationCounts),
          datasets: [
            {
              data: Object.values(locationCounts),
              backgroundColor: ['#FF6384', '#36A2EB', '#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            },
          ],
        })

        setDataManufacturer({
          labels: Object.keys(manufacturerCounts),
          datasets: [
            {
              data: Object.values(manufacturerCounts),
              backgroundColor: ['#FF6384', '#36A2EB', '#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            },
          ],
        })

        setTotalAssets(total)
      } catch (error) {
        console.error('Error in fetchData:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <CContainer>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>Total Assets: {totalAssets}</CCardHeader>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Asset Count by Location</CCardHeader>
                <CCardBody>
                  {dataLocation ? (
                    <CChartBar
                      data={dataLocation}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>No data available</p>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Count by Location (Doughnut)</CCardHeader>
                <CCardBody>
                  {dataLocation ? (
                    <CChartDoughnut
                      data={dataLocation}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>No data available</p>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardHeader>Asset Count by Manufacturer</CCardHeader>
                <CCardBody>
                  {dataManufacturer ? (
                    <CChartBar
                      data={dataManufacturer}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  ) : (
                    <p>No data available</p>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default DevicePopulation
