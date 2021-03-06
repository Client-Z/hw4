const http = require('http')
const pug = require('pug')
const qs = require('querystring')

let fieldName = ''

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}/`
  const compiledForm = pug.compileFile('./views/form.pug')
  const compiledTemplate = pug.compileFile('./views/result_template.pug')
  // routing
  res.setHeader('content-type', 'text/html')
  if (req.method === 'GET' && req.url !== '/favicon.ico') {
    const findParam = new URL(req.url, baseURL).searchParams
    fieldName = findParam.has('fieldName') ? findParam.get('fieldName') : 'default'
    res.write(compiledForm({ fieldName }))
    res.end()
  } else if (req.method === 'POST' && req.url === '/') {
    let body = ''
    req.on('data', (data) => {
      body += data
      // if we are getting too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) req.connection.destroy()
    })
    req.on('end', () => {
      const post = qs.parse(body)
      res.write(compiledTemplate({ fieldName, value: post[fieldName] }))
      res.end()
    })
  } else {
    res.write('wrong request')
  }
})

server.listen(3000, (err) => {
  if (err) console.error('something bad happened', err)
})
