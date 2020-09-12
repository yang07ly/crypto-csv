const fs = require('fs')
const axios = require('axios')
const crypto = require('crypto')

const OUTPUT_FILENAME = 'walletHistory.csv'
const BASE_URL = 'https://testnet.bitmex.com'
const ENDPOINT = '/api/v1/user/walletHistory'
const API_KEY = 'BwOSpThKIbo6NfxnY5jACWQS'
const API_SECRET = 'A73b4V_Sf3i-VwuxcSP9w7yE6Kv7nN6u6Eg5WN7FC_KlWXAY'
const QUERY_LIMIT = 35000

// handles HTTP requests
const run = () => {
  const timestamp = getTimestamp(6000)
  const querySuffix = '?count=' + QUERY_LIMIT
  const signature = getSignature(
    API_SECRET,
    'GET',
    ENDPOINT + querySuffix,
    timestamp,
    ''
  )
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'api-expires': timestamp,
      'api-key': API_KEY,
      'api-signature': signature
    }
  })
  const path = BASE_URL + ENDPOINT + querySuffix
  console.log('Fetching data from ' + path + '...')
  return instance.get(path)
    .then(response => {
      console.log('Successfully fetched data from ' + path + '.')
      return processData(response.data, OUTPUT_FILENAME)
    }).then(response => {
      console.log(response)
    }).catch(error => {
      if (error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    })
}

// generates api-expires
const getTimestamp = num => {
  return Math.round(Date.now() / 1000) + num
}

// generates api-signature
const getSignature = (secret, verb, path, timestamp, data) => {
  const query = verb + path + timestamp + data
  return crypto.createHmac('sha256', secret)
    .update(query).digest('hex')
}

// translates the query result into CSV content
const processData = (data, output) => {
  if (!Array.isArray(data)) {
    data = [data]
  }
  console.log('Sample Data', data[0])
  const headers = []
  for (const header in data[0]) {
    if (typeof data[0][header] !== 'object') {
      headers.push(header)
    }
  }
  const rows = [headers.join(',')]
  data.forEach(row => {
    const content = []
    for (let i = 0; i < headers.length; i++) {
      content.push(row[headers[i]])
    }
    rows.push(content.join(','))
  })
  const content = rows.join('\n')
  console.log('Writing data to ' + output + '...')
  return writeCSV(output, content)
}

const writeCSV = (path, data) => {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, err => {
      if (err) {
        reject(err)
      }
      resolve('Successfully written data to ' + path + '.')
    })
  )
}

run()
