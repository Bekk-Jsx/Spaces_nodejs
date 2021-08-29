const express = require('express');
const progresqlConection = require('./connection');

const mainRouter = require('./Router/mainRoutes');
const mainUsersRouter = require('./Router/mainUsersRoutes');

const spacesRouter = require('./Router/Tenant/spacesRoutes');
const topicsRoutes = require('./Router/Tenant/topicsRoutes');
const inviteRoutes = require('./Router/Tenant/inviteRoutes');
const usersRoutes = require('./Router/Tenant/usersRoutes');

require("dotenv").config()





// App Express 
const app = express();


// progresql Connection 
progresqlConection();

// Body
app.use(
    express.json({
        limit: "10kb"
    })
);

// Routers

app.use('/api/v1/main', mainRouter);
app.use('/api/v1/main_auth', mainUsersRouter);


app.use('/api/v1/tenant/spaces', spacesRouter);
app.use('/api/v1/tenant/topics', topicsRoutes);
app.use('/api/v1/tenant/invite', inviteRoutes);
app.use('/api/v1/tenant/users', usersRoutes);



module.exports = app;