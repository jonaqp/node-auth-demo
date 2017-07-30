import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import helmet from 'helmet';
import methodOverride from 'method-override';
import expressStatusMonitor from 'express-status-monitor';
import {graphiqlExpress, graphqlExpress} from 'graphql-server-express';
import schema from './graphql/schema/schema';

import db from './config/db';


const PORT = process.env.PORT || 3000;
const BODY_LIMIT = process.env.BODY_LIMIT || '100kb';
const CORS_HEADER = process.env.CORS_HEADER || ['Link'];
const log = console.warn;
const app = express();


app.server = http.createServer(app);
app.use(compression());
app.use(bodyParser.json({limit: BODY_LIMIT}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({exposedHeaders: CORS_HEADER}));
app.use(expressStatusMonitor());
app.use(methodOverride());


app.use(favicon(path.join(__dirname, 'utils', 'favicon.png')));
app.use(morgan('dev'));


app.use('/graphql',
  graphqlExpress({
    context: {
      db
    },
    schema,
    formatError: err => ({ message: err.message, status: err.status }),
  })
);

app.use('/graphiql',
  graphiqlExpress({
    endpointURL: 'graphql'
  }));


app.server.listen(PORT, err => {
  if (err) {
    log(chalk.red('Cannot run!'));
  } else {
    log(
      chalk.green.bold(
        `
            Yep this is working 🍺
            App listen on port: ${PORT} 🍕
            Env: ${process.env.NODE_ENV} 🦄
        `
      )
    );
  }
});

app.get('*', (req, res) => {
  res.json({
    message: 'graphql server at /graphiql endpoint',
  });
});

export default app;
