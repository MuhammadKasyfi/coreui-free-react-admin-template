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
  const [filterPlatform, setFilterPlatform] = useState([]) // Selected filter locations
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
    return date.toLocaleString()
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

  // Handle checkbox change for filtering
  const handleLocationFilterChange = (e) => {
    const platform = e.target.value
    setFilterPlatform((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform],
    )
  }

  // Apply filter based on selected locations
  const applyFilter = () => {
    const combinedData = getCombinedData()

    if (filterPlatform.length === 0) {
      setFilteredData(combinedData)
    } else {
      const filtered = combinedData.filter((item) => filterPlatform.includes(item.Platform))
      setFilteredData(filtered)
    }
  }

  useEffect(() => {
    if (data.length > 0) fetchDemoData()
  }, [data])


  const uniquePlatforms = Array.from(new Set(data.map((item) => item.Platform)))


  useEffect(() => {
    if (filterPlatform.length === 0) {
      setFilteredData(getCombinedData())
    }
  }, [filterPlatform, data, demoData])

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {/* Filter Section */}
          <p>Filter by Platform</p>
          {uniquePlatforms.map((platform, index) => (
            <CFormCheck
              key={index}
              label={platform}
              value={platform}
              checked={filterPlatform.includes(platform)}
              onChange={handleLocationFilterChange}
            />
          ))}
          <CButton color="primary" onClick={applyFilter} style={{ marginTop: '1rem' }}>
            Apply Filter
          </CButton>
        </div>

        <div style={{ flex: 3 }}>
          {/* Table Section */}
          <h3>Device List</h3>

          {loading ? (
            <p>Loading data...</p>
          ) : filteredData.length > 0 ? (
            <CTable striped bordered hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>AMS Tag</CTableHeaderCell>
                  <CTableHeaderCell>Platform</CTableHeaderCell>
                  <CTableHeaderCell>Health Index</CTableHeaderCell>
                  <CTableHeaderCell>Timestamp</CTableHeaderCell>
                  <CTableHeaderCell>Serial Number</CTableHeaderCell>
                  <CTableHeaderCell>Manufacturer</CTableHeaderCell>
                  <CTableHeaderCell>Model Number</CTableHeaderCell>
                  <CTableHeaderCell>Device Revision</CTableHeaderCell>
                  <CTableHeaderCell>HART Protocol Revision</CTableHeaderCell>
                  <CTableHeaderCell>Protocol</CTableHeaderCell>
                  <CTableHeaderCell>Criticality</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>{item.AssetTag}</CTableDataCell>
                    <CTableDataCell>{item.Platform}</CTableDataCell>
                    <CTableDataCell>{item.healthIndex}</CTableDataCell>
                    <CTableDataCell>{item.time}</CTableDataCell>
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
    </div>
  )
}

export default DeviceListing
