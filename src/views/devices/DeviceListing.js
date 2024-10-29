import React, { useEffect, useState, useContext } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
} from '@coreui/react'
// import { AuthContext } from '../../auth/AuthContext'

// Manufacturer: Fish Controls (Asset.Manufacturer property name) 
// Protocol: HART
// Device Tag: LCV-2011 (retrieve using ../LCV-2011.asset.tag)
// Device Type: 9 (retrieve using ../LCV-2011.DeviceTypeCode)
// Serial No.: 9756693 (retrieve using ../LCV-2011.Asset.SerialNumber)
// Criticality: C1 (retrieve using ../LCV-2011.criticality)

const DeviceListing = () => {
  // const { token } = useContext(AuthContext)
  const [devices, setDevices] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [area, setArea] = useState('all')
//   const [deviceType, setDeviceType] = useState('all')
//  // const [selectedColumns, setSelectedColumns] = useState(['AMStag', 'Manufacturer', 'DeviceType'])

//   const columnOptions = [
//     { label: 'Asset Tag', value: 'Asset.Tag' },
//     { label: 'Manufacturer', value: 'Asset.Manufacturer' },
//     { label: 'Model Number', value: 'Asset.ModelNumber' },
//     { label: 'Device Rev', value: 'DeviceRev' },
//     { label: 'Location Path', value: 'LocationPath' },
//     { label: 'Physical Path', value: 'PhysicalPath' },
//     { label: 'Serial No', value: 'Asset.SerialNumber' },
//     { label: 'Criticality', value: 'Criticality' },
//   ]

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`https://localhost:8002/api/assetdetails`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         })

//         if (!response.ok) throw new Error('Network response was not ok')

//         const data = await response.json()
//         setDevices(data)
//       } catch (error) {
//         setError(error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchAreas = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`https://localhost:8002/api/areas`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         })

//         if (!response.ok) throw new Error('Network response was not ok')

//           const data = await response.json()
//           setDevices(data)
//         } catch (error) {
//           setError(error.message)
//         } finally {
//           setLoading(false)
//         }      
//       }

//     fetchAreas()
//     fetchDevices()
//   }, [])

//   const filteredDevices = devices.filter((device) => {
//     return (
//       (area === 'all' || device.Area === area) &&
//       (deviceType === 'all' || device.DeviceType === deviceType)
//     )
//   })

//   const handleDeviceTypeChange = (e) => {
//     const value = e.target.value
//     setDeviceType((prev) => 
//       prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
//   )
//   }


  return (
    // <>
    // <CCol md={3}>
    //   <h5>Area</h5>
    //   {/* {areas.map((area) => (
    //     <CFormCheck
    //       key={area}
    //       label={area}
    //       checked={selectedAreas.includes(area)}
    //       onChange={handleAreaChange}
    //       />
    //   ))} */}
    // </CCol>

    //   <CCol md={3}>
    //           {/* Device Type Filter */}
    //             <h5>Device Type</h5>
                
    //           </CCol>

    //           {/* Column Selection */}
    //           <CCol md={6}>
    //             <h5>Select Columns</h5>
    //             {/* {columnOptions.map((col) => (
    //               <CFormCheck
    //                 key={col.value}
    //                 label={col.label}
    //                 checked={selectedColumns.includes(col.value)}
    //                 onChange={() => handleColumnChange(col.value)}
    //               />
    //             ))} */}
    //           </CCol>

    //           {/* Device Details Table */}
    //           <CCol md={12} className="mt-4">
    //             {loading ? (
    //               <div>Loading...</div>
    //             ) : error ? (
    //               <div>Error: {error}</div>
    //             ) : (
    //               <CTable responsive>
    //                 <CTableHead>
    //                   <CTableRow>
    //                     {selectedColumns.map((col) => (
    //                       <CTableHeaderCell key={col}>{col}</CTableHeaderCell>
    //                     ))}
    //                   </CTableRow>
    //                 </CTableHead>
    //                 <CTableBody>
    //                   {filteredDevices.map((device, index) => (
    //                     <CTableRow key={index}>
    //                       {selectedColumns.map((col) => (
    //                         <CTableDataCell key={col}>{device[col]}</CTableDataCell>
    //                       ))}
    //                     </CTableRow>
    //                   ))}
    //                 </CTableBody>
    //               </CTable>
    //             )}
    //           </CCol>
    //         {/* </CRow>
    //       </CCardBody>
    //     </CCard>
    //   </CCol>
    // </CRow> */}
    // </>

    // ******************************* NEW *********************************

    <>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Class</CTableHeaderCell>
            <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
            <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">1</CTableHeaderCell>
            <CTableDataCell>Mark</CTableDataCell>
            <CTableDataCell>Otto</CTableDataCell>
            <CTableDataCell>@mdo</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">2</CTableHeaderCell>
            <CTableDataCell>Jacob</CTableDataCell>
            <CTableDataCell>Thornton</CTableDataCell>
            <CTableDataCell>@fat</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">3</CTableHeaderCell>
            <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
            <CTableDataCell>@twitter</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </>
  )
}

export default DeviceListing
