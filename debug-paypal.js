const http = require('http');

const data = JSON.stringify({
    planId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || "P-56116506YK8033059NGBSMNQ"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/paypal/create-subscription',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
