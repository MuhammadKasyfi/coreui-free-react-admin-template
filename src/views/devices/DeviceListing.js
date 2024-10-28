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
import { AuthContext } from './auth/AuthContext'

const DeviceListing = () => {
  const { token } = useContext(AuthContext)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [area, setArea] = useState('all')
  const [deviceType, setDeviceType] = useState('all')
  const [selectedColumns, setSelectedColumns] = useState(['AMStag', 'Manufacturer', 'DeviceType'])

  const columnOptions = [
    { label: 'Asset Tag', value: 'Asset.Tag' },
    { label: 'Manufacturer', value: 'Asset.Manufacturer' },
    { label: 'Model Number', value: 'Asset.ModelNumber' },
    { label: 'Device Rev', value: 'DeviceRev' },
    { label: 'Location Path', value: 'LocationPath' },
    { label: 'Physical Path', value: 'PhysicalPath' },
    { label: 'Serial No', value: 'Asset.SerialNumber' },
    { label: 'Criticality', value: 'Criticality' },
  ]

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://localhost:8002/api/v2`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Network response was not ok')

        const data = await response.json()
        setDevices(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [token, area, deviceType])

  const filteredDevices = devices.filter((device) => {
    return (
      (area === 'all' || device.Area === area) &&
      (deviceType === 'all' || device.DeviceType === deviceType)
    )
  })

  // Handle column selection changes
  const handleColumnChange = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column],
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Device Listing</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {/* Area Selection */}
              <CCol md={3}>
                <h5>Area</h5>
                <CFormSelect value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="all">All</option>
                  <option value="DeltaV">DeltaV</option>
                  <option value="HartMultiplexer">Hart Multiplexer</option>
                </CFormSelect>
              </CCol>

              {/* Device Type Filter */}
              <CCol md={3}>
                <h5>Device Type</h5>
                <CFormSelect value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
                  <option value="all">All</option>
                  <option value="PT">PT</option>
                  <option value="QZT">QZT</option>
                  <option value="LCV">LCV</option>
                  <option value="TT">TT</option>
                  {/* <option value="Wireless">Wireless</option> */}
                </CFormSelect>
              </CCol>

              {/* Column Selection */}
              <CCol md={6}>
                <h5>Select Columns</h5>
                {columnOptions.map((col) => (
                  <CFormCheck
                    key={col.value}
                    label={col.label}
                    checked={selectedColumns.includes(col.value)}
                    onChange={() => handleColumnChange(col.value)}
                  />
                ))}
              </CCol>

              {/* Device Details Table */}
              <CCol md={12} className="mt-4">
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div>Error: {error}</div>
                ) : (
                  <CTable responsive>
                    <CTableHead>
                      <CTableRow>
                        {selectedColumns.map((col) => (
                          <CTableHeaderCell key={col}>{col}</CTableHeaderCell>
                        ))}
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredDevices.map((device, index) => (
                        <CTableRow key={index}>
                          {selectedColumns.map((col) => (
                            <CTableDataCell key={col}>{device[col]}</CTableDataCell>
                          ))}
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DeviceListing
