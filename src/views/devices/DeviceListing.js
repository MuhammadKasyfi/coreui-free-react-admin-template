//csv to json
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
} from '@coreui/react'

const DeviceListing = () => {
  const [data, setData] = useState([])
  const [demoData, setDemoData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem('uploadedCSVData')
    if (savedData) {
      setData(JSON.parse(savedData))
    }
  }, [])

  const getDemoData = async (assetTag, baseIdentifier, locationPath, isa95Path) => {
    // 'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'
    //   const opticsURL = 'https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011' // replace LCV-2011 with loop value
    //  const identifier = 'identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011'
    //   ${opticsURL}.Asset.tag&${identifier}.Asset.Manufacturer`,

    //https://localhost:8002/api/v2/read?identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011/_healthindex&identifier=/System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011.Asset.manufacturer
    const baseUrl = 'https://localhost:8002/api/v2/read'
    const identifier = `/${baseIdentifier}/${locationPath}/${assetTag}`
    const isaIdentifier = `/${isa95Path}/${assetTag}`
    // const identifier = `/${locationPath}/${assetTag}`
    const url = `${baseUrl}?identifier=${identifier}`
    const param = `identifier=${identifier}`
    const param2 = `identifier=${isaIdentifier}`

    try {
      const token = await getOAuthToken()
      const response = await axios.get(
        `${url}/_healthindex&${param}.Asset.SerialNumber&${param}.Asset.Manufacturer&${param}.Asset.ModelNumber&${param2}.DeviceRevision&${param2}.HARTProtocolRevision&${param}.Criticality`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      if (assetTag) console.log(`Fetched data for ${assetTag}:`, response.data)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching data for ${assetTag}:`, error.response?.data || error.message)
    }
  }

  getDemoData()

  const fetchDemoData = async () => {
    setLoading(true)
    const token = await getOAuthToken()
    console.log(token) //to console only 1  token
    if (!token) {
      console.error('Failed to retrieve OAuth token.')
      setLoading(false)
      return
    }

    const allData = []
    for (const item of data) {
      const assetTag = item.AssetTag
      if (assetTag) {
        // const fetchedData = await getDemoData(item.AssetTag, item.LocationPath)
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
          criticality: fetchedData?.[6]?.v || 'N/A',
        })
      }
    }
    setDemoData(allData)
    setLoading(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: true, //convert csv to json
        skipEmptyLines: true,
        complete: (result) => {
          const jsonData = result.data.map((row, index) => ({
            id: `${index + 1}`, //assign id
            ...row, // include original row data
          }))
          setData(jsonData)
          localStorage.setItem('uploadedCSVData', JSON.stringify(jsonData)) //save to localStorage
        },
      })
    }
  }

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
        criticality: demoItem?.criticality || 'N/A',
      }
    })
  }

  useEffect(() => {
    if (data.length > 0) fetchDemoData()
  }, [data])

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <h3>Asset List</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : data.length > 0 ? (
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
              <CTableHeaderCell>Criticality</CTableHeaderCell>
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
                <CTableDataCell>{item.deviceRevision}</CTableDataCell>
                <CTableDataCell>{item.hartProtocolRevision}</CTableDataCell>
                <CTableDataCell>{item.criticality}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p>No data available. Please upload a CSV file</p>
      )}
    </div>
  )
}

export default DeviceListing
