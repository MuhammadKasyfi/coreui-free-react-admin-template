import React, { useEffect, useState } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import { getOAuthToken } from '../../auth/authToken'
import '../../scss/chart.scss'
import axios from 'axios'

const DevicePopulation = () => {
  const [dataLocation, setDataLocation] = useState(null)
  const [dataManufacturer, setDataManufacturer] = useState(null)
  const [totalAssets, setTotalAssets] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch demo data based on asset tag and other parameters
  const getDemoData = async (assetTag, baseIdentifier, locationPath, isa95Path) => {
    const baseUrl = 'https://localhost:8002/api/v2/read'
    const identifier = `${baseIdentifier}/${locationPath}/${assetTag}`
    const isaIdentifier = `${isa95Path}/${assetTag}`
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
      return response?.data?.data || {}
    } catch (error) {
      console.error(`Error fetching data for ${assetTag}:`, error.response?.data || error.message)
      return {} // Fallback to empty object
    }
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
                <CCardHeader>Device Count by Location</CCardHeader>
                {/* <CCardBody className="chart-container"> */}
                <CCardBody>
                  {dataLocation ? (
                    <CChartBar
                      data={dataLocation}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
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
                <CCardHeader>Count by Location</CCardHeader>
                <CCardBody className="chart-container">
                  {dataLocation ? (
                    <CChartDoughnut
                      data={dataLocation}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
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
                {/* <CCardBody className="chart-container"> */}
                <CCardBody>
                  {dataManufacturer ? (
                    <CChartBar
                      data={dataManufacturer}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
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
                <CCardHeader>Count by Manufacturer</CCardHeader>
                <CCardBody className="chart-container">
                  {dataManufacturer ? (
                    <CChartDoughnut
                      data={dataManufacturer}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
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
