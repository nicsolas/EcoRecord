
const express = require('express');
const app = express();
const router = express.Router();

router.get('/test', (req, res) => res.send('router-test'));
app.use('/api', router);
app.get('/db-test', (req, res) => res.send('app-db-test'));

console.log("Simulating requests...");

// Simple mock for testing routing
function testRoute(url) {
  console.log(`Testing URL: ${url}`);
  // This is a simplification, but helps visualize
  if (url.startsWith('/api')) {
    const sub = url.slice(4);
    if (sub === '/test') console.log(" -> Matched /api/test via router");
    else console.log(` -> No match in router for ${sub}`);
  }
  if (url === '/db-test') console.log(" -> Matched /db-test via app");
  else if (url === '/api/db-test') console.log(" -> No match for /api/db-test on app (registered as /db-test)");
}

testRoute('/api/test');
testRoute('/api/db-test');
testRoute('/db-test');
