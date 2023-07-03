'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 3002
const { db } = require('./src/auth/models');
// const { db } = require('./src/models');

// const server = require('./src/server.js');
const app = require('./src/server');

db.sync().then(() => {
  app.start(PORT);
  // server.start(PORT);
});

//auth-server
// 'use strict';
// require('dotenv').config();
// const app = require('./src/server.js');
// const { db } = require('./src/auth/models');

// db.sync().then(() => {
//   app.start(process.env.PORT || 3002);
// });
//api-server
// 'use strict';
// require('dotenv').config();
// const { db } = require('./src/models');
// const server = require('./src/server.js');
// const PORT = process.env.PORT || 3001

// db.sync().then(() => {
//   server.start(PORT);
// });
