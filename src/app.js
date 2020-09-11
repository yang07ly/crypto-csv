const fs = require('fs')
const axios = require('axios')
const crypto = require('crypto')
const readline = require('readline')
const secrets = require('dotenv').config()

// start point of the program
const io = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Please enter data endpoint: ',
    async (endpoint) => {
      console.log('Please enter query parameters by line' +
        ' (e.g. count: 50), hit enter in the new line to stop: ')
      const params = []
      for await (const line of rl) {
        if (line.trim().length === 0) {
          break
        } else {
          params.push(line.trim())
        }
      }
      run(endpoint, params).then(response => {
        console.log(response)
        console.log('Program closed.')
        rl.close()
      }).catch(error => {
        if (error.response) {
          console.error(error.response.data)
        } else {
          console.error(error)
        }
        rl.close()
      })
    })
}

// handles HTTP requests
const run = (input, params) => {
  if (!secrets || !secrets.parsed) {
    throw Error('.env file is missing.')
  }
  let BASE_URL = secrets.parsed.BASE_URL
  if (BASE_URL[BASE_URL.length - 1] === '/') {
    BASE_URL = BASE_URL.substring(0, BASE_URL.length - 1)
  }
  const API_SECRET = secrets.parsed.API_SECRET
  const API_KEY = secrets.parsed.API_KEY
  if (!BASE_URL || !API_SECRET || !API_KEY) {
    throw Error('Please check your .env file.')
  }

  const output = getOutputFileName(input)
  let path = '/api/v1/' + input
  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    const key = param.substring(0, param.indexOf(':'))
    const val = param.substring(param.indexOf(':') + 1)
    path += i === 0 ? '?' : '&'
    path += key.trim() + '=' + encodeURI(val.trim())
  }
  const timestamp = getTimestamp(6000)
  const signature = getSignature(
    API_SECRET,
    'GET',
    path,
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
  console.log('Fetching data from ' + BASE_URL + path + '...')
  return instance.get(path)
    .then(response => {
      console.log('Successfully fetched data from ' +
        BASE_URL + path + '.')
      return processData(response.data, output)
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

// generates the filename of the output CSV
const getOutputFileName = input => {
  const params = input.split('/')
  return params[params.length - 1] + '.csv'
}

// translates the query result into CSV content
const processData = (data, output) => {
  if (!Array.isArray(data)) {
    data = [data]
  }
  console.log('Sample data', data[0])
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

io()
