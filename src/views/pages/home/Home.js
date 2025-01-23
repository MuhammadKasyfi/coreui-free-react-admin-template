/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader, CContainer } from '@coreui/react'
import GaugeComponent from 'react-gauge-component'
import { getOAuthToken } from '../../../auth/authToken'
import axios from 'axios'

const Home = () => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data for all assets
  const fetchAssets = async () => {
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

      // Fetch healthIndex for each asset
      const assetPromises = parsedData.map(async (row) => {
        const { AssetTag, Platform, BaseIdentifier, LocationPath } = row
        const baseUrl = 'https://localhost:8002/api/v2/read'
        const identifier = `/${BaseIdentifier}/${LocationPath}/${AssetTag}`
        const url = `${baseUrl}?identifier=${identifier}`

        try {
          const response = await axios.get(`${url}/_healthindex`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          })

          const healthIndex = response.data.data?.[0]?.v || 0
          return { AssetTag, Platform, healthIndex }
        } catch (error) {
          console.error(
            `Error fetching healthIndex for ${AssetTag}:`,
            error.response?.data || error.message,
          )
          return { AssetTag, Platform, healthIndex: 0 }
        }
      })

      const results = await Promise.all(assetPromises)
      setAssets(results)
    } catch (error) {
      console.error('Error fetching asset data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  return (
    <CContainer>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CRow>
          {assets.map((asset, index) => (
            <CCol xs={12} sm={6} md={4} key={index}>
              <CCard className="mb-4">
                <CCardHeader>{`Health Index Asset: ${asset.Platform}/${asset.AssetTag}`}</CCardHeader>
                <CCardBody>
                  <GaugeComponent
                    arc={{
                      width: 0.05,
                      padding: 0,
                      subArcs: [
                        { limit: 70, color: '#EA4228', showTick: true },
                        { limit: 80, color: '#F5CD19', showTick: true },
                        { limit: 100, color: '#5BE12C', showTick: true },
                      ],
                    }}
                    pointer={{
                      type: 'arrow',
                      color: '#000',
                      size: 0.1, // you can tweak this for better pointer size
                    }}
                    labels={{
                      tickLabels: {
                        type: "outer",
                        ticks: [
                          { value: 0 },
                          { value: 10 },
                          { value: 20 },
                          { value: 30 },
                          { value: 40 },
                          { value: 50 },
                          { value: 60 },
                          { value: 70 },
                          { value: 80 },
                          { value: 90 },
                          { value: 100 },
                        ],
                      }                      
                  }}
                    value={asset.healthIndex}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      )}
    </CContainer>
  )
}

export default Home
