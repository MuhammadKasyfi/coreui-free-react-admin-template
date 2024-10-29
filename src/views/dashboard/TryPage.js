import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const TryPage = () => {
        const [demoData, setDemoData] = useState([])
      
        const getOAuthToken = async () => {
          const tokenUrl = 'https://localhost:8002/api/oauth2/token'
      
          const credentials = {
            grant_type: 'password',
            authority: 'builtin',
            username: 'OpticsWEBAPIL4',
            password: 'EmersonProcess#1',
          }
      
          try {
            const response = await axios.post(tokenUrl, new URLSearchParams(credentials), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
      
            const token = response.data.access_token
            console.log('Token: ', token)
      
            return token
          } catch (error) {
            console.error('Error fetchin token: ', error)
            return null
          }
        }
        const getDemoData = async (token) => {

            //continue tomorrow here
        }
    }
export default TryPage;