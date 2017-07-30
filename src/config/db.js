import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/auth_demo';
const options = {
  promiseLibrary: global.Promise,
  useMongoClient: true,
};
mongoose.set('debug', process.env.MONGODB_URI);


try {
  mongoose.connect(MONGODB_URI, options);
} catch (err) {
  mongoose.createConnection(MONGODB_URI, options);
}

const connection = mongoose.connection;

connection
  .once('open', () => {
    console.log('MongoDB Running');
  })
  .once('close', () => {
    console.log('MongoDB Closed');
    process.exit(0);
  })
  .on('error', e => {
    console.log(e);
  });


export default mongoose;
