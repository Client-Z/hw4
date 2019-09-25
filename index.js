const http = require('http');

const server = http.createServer((req, res) => {
	var baseURL = 'http://' + req.headers.host + '/';
	// routing
	res.setHeader('content-type', 'text/html');
	if(req.method === 'GET' && req.url != '/favicon.ico') {
		const findParam = new URL(req.url, baseURL).searchParams;
		const fieldName = findParam.has('fieldName') ? findParam.get('fieldName') : 'default';
		console.log(fieldName);
		res.write(`
			<input type="text" name="${fieldName}">
		`);
	} else {
		res.write(`
			hi
		`);
	}
	res.end();
});

server.listen(3000, (err) => {
    if (err) return console.log('something bad happened', err)
});