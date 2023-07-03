'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');

const v1Routes = require('./auth/routes/v1');
const v2Routes = require('./auth/routes/v2');

// Esoteric Resources
const errorHandler = require('./middleware/500');
const notFound = require('./middleware/404');
const authRoutes = require('./auth/routes/router');
const logger = require('./auth/middleware/logger');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);


// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
