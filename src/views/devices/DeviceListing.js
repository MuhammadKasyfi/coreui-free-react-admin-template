import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { getOAuthToken } from '../../auth/authToken'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormInput,
  CButton,
  CFormCheck,
} from '@coreui/react'

const DeviceListing = () => {
  const [data, setData] = useState([]) // Store uploaded CSV data
  const [demoData, setDemoData] = useState([]) // Store demo data fetched via API
  const [loading, setLoading] = useState(false)
  const [filterLocations, setFilterLocations] = useState([]) // Selected filter locations
  const [filteredData, setFilteredData] = useState([]) // Filtered data

  useEffect(() => {
    const savedData = localStorage.getItem('uploadedCSVData')
    if (savedData) {
      setData(JSON.parse(savedData)) // Load previously saved CSV data from localStorage
    }
  }, [])

  // Function to fetch demo data based on asset tag and other parameters
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
        })
      }
    }
    setDemoData(allData)
    setLoading(false)
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
      }
    })
  }

  // Handle checkbox change for filtering
  const handleLocationFilterChange = (e) => {
    const location = e.target.value
    setFilterLocations((prev) =>
      prev.includes(location) ? prev.filter((item) => item !== location) : [...prev, location],
    )
  }

  // Apply filter based on selected locations
  const applyFilter = () => {
    const combinedData = getCombinedData()

    // If no filter is selected, show all data
    if (filterLocations.length === 0) {
      setFilteredData(combinedData)
    } else {
      const filtered = combinedData.filter((item) => filterLocations.includes(item.AssetLocation))
      setFilteredData(filtered)
    }
  }

  useEffect(() => {
    if (data.length > 0) fetchDemoData()
  }, [data])

  // Extract unique asset locations from data
  const uniqueLocations = Array.from(new Set(data.map((item) => item.AssetLocation)))

  // Set filtered data when no filter is applied
  useEffect(() => {
    if (filterLocations.length === 0) {
      setFilteredData(getCombinedData()) // Show all data if no filter
    }
  }, [filterLocations, data, demoData])

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {/* Filter Section */}
        <p>Filter by Asset Location</p>
        {uniqueLocations.map((location, index) => (
          <CFormCheck
            key={index}
            label={location}
            value={location}
            checked={filterLocations.includes(location)}
            onChange={handleLocationFilterChange}
          />
        ))}
        <CButton color="primary" onClick={applyFilter} style={{ marginTop: '1rem' }}>
          Apply Filter
        </CButton>
      </div>

      <div style={{ flex: 3 }}>
        {/* Table Section */}
        <h3>Asset List</h3>

        {loading ? (
          <p>Loading data...</p>
        ) : filteredData.length > 0 ? (
          <CTable striped bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Asset Tag</CTableHeaderCell>
                <CTableHeaderCell>Asset Location</CTableHeaderCell>
                <CTableHeaderCell>Health Index</CTableHeaderCell>
                <CTableHeaderCell>Serial Number</CTableHeaderCell>
                <CTableHeaderCell>Manufacturer</CTableHeaderCell>
                <CTableHeaderCell>Model Number</CTableHeaderCell>
                <CTableHeaderCell>Device Revision</CTableHeaderCell>
                <CTableHeaderCell>HART Protocol Revision</CTableHeaderCell>
                <CTableHeaderCell>Interface</CTableHeaderCell>
                <CTableHeaderCell>Criticality</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.id}</CTableDataCell>
                  <CTableDataCell>{item.AssetTag}</CTableDataCell>
                  <CTableDataCell>{item.AssetLocation}</CTableDataCell>
                  <CTableDataCell>{item.healthIndex}</CTableDataCell>
                  <CTableDataCell>{item.serialNumber}</CTableDataCell>
                  <CTableDataCell>{item.manufacturer}</CTableDataCell>
                  <CTableDataCell>{item.modelNumber}</CTableDataCell>
                  <CTableDataCell>{item.deviceRevision}</CTableDataCell>
                  <CTableDataCell>{item.hartProtocolRevision}</CTableDataCell>
                  <CTableDataCell>{item.interface}</CTableDataCell>
                  <CTableDataCell>{item.criticality}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p>No data available. Please upload a CSV file.</p>
        )}
      </div>
    </div>
  )
}

export default DeviceListing
