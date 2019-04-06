const pass = process.env.NODE_ORACLEDB_PASSWORD || require('./dbpassword');
module.exports = {

    user          : process.env.NODE_ORACLEDB_USER || "LIMA",
  
    // Instead of hard coding the password, consider prompting for it,
    // passing it in an environment variable via process.env, or using
    // External Authentication.
    password      : pass,
  
    // For information on connection strings see:
    // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "projectmanagement.cuvxvi5d2aqv.us-east-1.rds.amazonaws.com:1521/ORACL",
  
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };