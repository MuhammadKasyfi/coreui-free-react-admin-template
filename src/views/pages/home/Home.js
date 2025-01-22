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
        const { AssetTag, AssetLocation, BaseIdentifier, LocationPath } = row
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
          return { AssetTag, AssetLocation, healthIndex }
        } catch (error) {
          console.error(
            `Error fetching healthIndex for ${AssetTag}:`,
            error.response?.data || error.message,
          )
          return { AssetTag, AssetLocation, healthIndex: 0 }
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
                <CCardHeader>{`Health Index Asset: ${asset.AssetLocation}/${asset.AssetTag}`}</CCardHeader>
                <CCardBody>
                  <GaugeComponent
                    arc={{
                      subArcs: [
                        { limit: 20, color: '#EA4228', showTick: true },
                        { limit: 40, color: '#F58B19', showTick: true },
                        { limit: 60, color: '#F5CD19', showTick: true },
                        { limit: 100, color: '#5BE12C', showTick: true },
                      ],
                      thickness: 8,
                      labels: {
                        count: 11,
                        precision: 0,
                      },
                    }}
                    pointer={{
                      type: 'arrow',
                      color: '#000000',
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
