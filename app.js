import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session'
import msIdExpress from 'microsoft-identity-express'

const appSettings = {
  appCredentials: {
    clientId:  "ee9b2e71-3ce2-4f5a-8c54-b5f743f0959f",
    tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret:  "jj48Q~hOe6pEsApt~RX4ph3lgNPKn3LZd~n5ybFA"
  },
  authRoutes: {
    //https://www.chumbowumbo.me/redirect
    //http://localhost:3000/redirect
      redirect: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
      error: "/error", // the wrapper will redirect to this route in case of any error.
      unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
  }
};

import models from './models.js'
import usersRouter from './routes/v3/apiv3.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.models = models
  next()
})

const oneDay = 1000 * 60 * 60 * 24
app.use(session({
    secret: "this is some secret key",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

app.use('/api/v3', usersRouter);
//app.use('/api/v1', usersRouter);

app.get('/signin',
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized - permission was denied")
})

export default app;
