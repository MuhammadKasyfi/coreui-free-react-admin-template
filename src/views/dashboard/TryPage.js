//csv to json
import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const TryPage = () => {
  const [data, setData] = useState([]) // CSV data
  const [demoData, setDemoData] = useState([]) // Health index data
  const [loading, setLoading] = useState(false) // Loading state

  // Fetch health index data for a specific asset
  const getDemoData = async (assetTag, baseIdentifier, locationPath) => {
    const baseUrl = 'https://localhost:8002/api/v2/read'
    const identifier = `/${baseIdentifier}/${locationPath}${assetTag}`
    const url = `${baseUrl}?identifier=${identifier}`
    const param = `identifier=${identifier}`

    try {
      const token = await getOAuthToken()
      const response = await axios.get(
        `${url}/_healthindex&${param}.Asset.SerialNumber&${param}.Asset.Manufacturer&${param}.Asset.ModelNumber&${param}.LocationPath&${param}.PhysicalPath`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      // return response.data.data || []
      return response.data.data
    } catch (error) {
      console.error(`Error fetching data for ${assetTag}:`, error.response?.data || error.message)
      // return []
    }
  }

  getDemoData()

  // Fetch demo data for all assets
  const fetchDemoData = async () => {
    setLoading(true)
    const token = await getOAuthToken()

    if (!token) {
      console.error('Failed to retrieve OAuth token.')
      setLoading(false)
      return
    }

    const allData = []
    for (const item of data) {
      if (item.AssetName) {
        const fetchedData = await getDemoData(item.AssetTag, item.BaseIdentifier, item.LocationPath)
        const healthIndex =
          fetchedData?.[0]?.v !== undefined && fetchedData?.[0]?.v !== null
            ? fetchedData?.[0]?.v
            : 'N/A'
        allData.push({
          id: item.id,
          healthIndex,
          serialNumber: fetchedData?.[1]?.v || 'N/A',
          manufacturer: fetchedData?.[2]?.v || 'N/A',
          modelNumber: fetchedData?.[3]?.v || 'N/A',
          locationPath: fetchedData?.[4]?.v || 'N/A',
          physicalPath: fetchedData?.[5]?.v || 'N/A',
        })
      }
    }
    setDemoData(allData)
    setLoading(false)
  }

  // Handle CSV file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const jsonData = result.data.map((row, index) => ({ id: `${index}`, ...row }))
          setData(jsonData)
        },
      })
    }
  }

  // Combine demo data with CSV data
  const getCombinedData = () => {
    return data.map((item) => {
      const demoItem = demoData.find((demo) => demo.id === item.id)
      return {
        ...item,
        healthIndex: demoItem?.healthIndex || 'N/A',
        serialNumber: demoItem?.serialNumber || 'N/A',
        manufacturer: demoItem?.manufacturer || 'N/A',
        modelNumber: demoItem?.modelNumber || 'N/A',
        locationPath: demoItem?.locationPath || 'N/A',
        physicalPath: demoItem?.physicalPath || 'N/A',
      }
    })
  }

  useEffect(() => {
    if (data.length > 0) fetchDemoData()
  }, [data])

  return (
    <div>
      <h2>CSV Uploader</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <h3>Asset List</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : data.length > 0 ? (
        <CTable striped bordered hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Asset Name</CTableHeaderCell>
              <CTableHeaderCell>Asset Location</CTableHeaderCell>
              <CTableHeaderCell>Health Index</CTableHeaderCell>
              <CTableHeaderCell>Serial Number</CTableHeaderCell>
              <CTableHeaderCell>Manufacturer</CTableHeaderCell>
              <CTableHeaderCell>Model Number</CTableHeaderCell>
              <CTableHeaderCell>Location Path</CTableHeaderCell>
              <CTableHeaderCell>Physical Path</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {getCombinedData().map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.AssetTag}</CTableDataCell>
                <CTableDataCell>{item.AssetLocation}</CTableDataCell>
                <CTableDataCell>{item.healthIndex}</CTableDataCell>
                <CTableDataCell>{item.serialNumber}</CTableDataCell>
                <CTableDataCell>{item.manufacturer}</CTableDataCell>
                <CTableDataCell>{item.modelNumber}</CTableDataCell>
                <CTableDataCell>{item.locationPath}</CTableDataCell>
                <CTableDataCell>{item.physicalPath}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p>No data available. Please upload a CSV file.</p>
      )}
    </div>
  )
}

export default TryPage
