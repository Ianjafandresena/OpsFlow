import http from 'http'

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/taches?typeTache=PUBLICATION,SPONSORISATION,MAILING,ADMINISTRATIVE',
  method: 'GET'
}

const req = http.request(options, res => {
  let data = ''
  res.on('data', chunk => { data += chunk })
  res.on('end', () => {
    console.log("Status:", res.statusCode)
    try {
      const json = JSON.parse(data)
      console.log("Tasks found:", json.length)
      if (json.length > 0) {
        console.log("First task:", json[0])
      }
    } catch (e) {
      console.log("Raw response:", data)
    }
  })
})

req.on('error', e => {
  console.error("Error:", e.message)
})

req.end()
