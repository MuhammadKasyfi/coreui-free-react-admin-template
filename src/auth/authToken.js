import axios from 'axios'

const tokenUrl = 'https://localhost:8002/api/oauth2/token'

const credentials = {
  grant_type: 'password',
  authority: 'builtin',
  username: 'OpticsWEBAPIL4',
  password: 'EmersonProcess#1',
}

/**
 * Funtion to get OAuth token
 * @returns {Promise<string>} OAuth token
 */

export const getOAuthToken = async () => {
  try {
    const response = await axios.post(tokenUrl, new URLSearchParams(credentials), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const token = response.data.access_token
    // console.log('Token: ', token)
    return token
  } catch (error) {
    console.error('Error fetching token: ', error.response?.data || error.message)
    throw new Error('Failed to retrieve OAuth token')
  }
}

export const getAuthUsername = async () => {
  try {
    const username = credentials.username
    return username
  } catch (error) {
    console.error('Error fetching token: ', error.response?.data || error.message)
    throw new Error('Failed to retrieve OAuth token')
  }
}

export const getAuthPassword = async () => {
  try {
    const password = credentials.password
    return password
  } catch (error) {
    console.error('Error fetching token: ', error.response?.data || error.message)
    throw new Error('Failed to retrieve OAuth token')
  }
}
