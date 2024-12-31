import axios from 'axios'

const tokenUrl = 'https://localhost:8002/api/oauth2/token'

const credentials = {
  grant_type: 'password',
  authority: 'builtin',
  username: 'OpticsWEBAPIl4',
  password: 'EmersonProcess#1',
}

/**
 * Function to get OAuth token
 * @returns {Promise<string>} OAuth token
 */

export const getOAuthToken = async () => {
  try {
    const response = await axios.post(tokenUrl, new URLSearchParams(credentials), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data.access_token
  } catch (error) {
    console.error('Error fetching token: ', error.response?.data || error.message)
    throw new Error('Failed to retrieve OAuth token')
  }
}
