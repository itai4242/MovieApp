var env = process.env.NODE_ENV || 'development';


if (env === 'development'|| env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key)=>{
    process.env[key] = envConfig[key];
  })
}
// mongodb://itai4242:itai3027@ds121475.mlab.com:21475/itaiexc

// var env = process.env.NODE_ENV || 'development';

  // process.env.PORT = 3000;
  // process.env.MONGODB_URI = `mongodb://itai4242:itai3027@ds121475.mlab.com:21475/itaiexc`; 
// else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://<itai4242>:<itai3027>@ds121475.mlab.com:21475/itaiexc';
// }
// mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]