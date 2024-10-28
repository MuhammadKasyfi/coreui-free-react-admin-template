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
import { AuthContext } from './AuthContext'

const DeviceListing = () => {
  const { token } = useContext(AuthContext) // Access token from AuthContext
  const [devices, setDevices] = useState([]) // Holds fetched devices
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [area, setArea] = useState('all')
  const [deviceType, setDeviceType] = useState('all')
  const [selectedColumns, setSelectedColumns] = useState(['AMStag', 'Manufacturer', 'DeviceType']) // Default columns

  // Column options for dynamic display
  const columnOptions = [
    { label: 'AMStag', value: 'AMStag' },
    { label: 'Manufacturer', value: 'Manufacturer' },
    { label: 'Device Type', value: 'DeviceType' },
    { label: 'Device Rev', value: 'DeviceRev' },
    { label: 'Protocol', value: 'Protocol' },
    { label: 'Serial No', value: 'SerialNo' },
    { label: 'Circuit', value: 'Circuit' },
  ]

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true)
        const response = await fetch(`API_ENDPOINT_HERE`, {
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
  }, [token, area, deviceType]) // Re-fetch data on area or deviceType changes

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
                  <option value="KNTC">KNTC</option>
                  <option value="KNPGB">KNPGB</option>
                </CFormSelect>
              </CCol>

              {/* Device Type Filter */}
              <CCol md={3}>
                <h5>Device Type</h5>
                <CFormSelect value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
                  <option value="all">All</option>
                  <option value="Fieldbus">Fieldbus</option>
                  <option value="Hart-DCS">Hart-DCS</option>
                  <option value="Hart-FGS">Hart-FGS</option>
                  <option value="Positioner">Positioner</option>
                  <option value="Wireless">Wireless</option>
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
