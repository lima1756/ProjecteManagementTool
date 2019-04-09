process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('../../config/dbconfig.js');


/**
 * Singleton DBController class
 * This singleton will be used in the app as the controller of the DB
 */
module.exports = class DBController{

    constructor(callback){
      if(!DBController.instance){
        return DBController.init()
          .then(answer=>{
            this.connection = answer;
            DBController.instance = this;
            if(callback!=null)
              callback(this);
          }).catch(error=>{
            throw new Error(error);
          });
      }
    }

    static async init(){
      return oracledb.getConnection(  {
          user          : dbConfig.user,
          password      : dbConfig.password,
          connectString : dbConfig.connectString
      })
    }

    executeSQL(sql, binds, options){

      options.outFormat= oracledb.OBJECT;
      options.autoCommit= true;
      return DBController.instance.connection.execute(sql, binds, options);
    }
}

// async function run() {
//   let connection;

//   try {

//     let sql, binds, options, result;
//     connection = await oracledb.getConnection(  {
//       user          : dbConfig.user,
//       password      : dbConfig.password,
//       connectString : dbConfig.connectString
//     });
    

//     // Create a table

//     await connection.execute(
//       `BEGIN
//          EXECUTE IMMEDIATE 'DROP TABLE mytab';
//          EXCEPTION
//          WHEN OTHERS THEN
//            IF SQLCODE NOT IN (-00942) THEN
//              RAISE;
//            END IF;
//        END;`);

//     await connection.execute(
//       `CREATE TABLE mytab (id NUMBER, data VARCHAR2(20))`);

//     // Insert some data

//     sql = `INSERT INTO mytab VALUES (:1, :2)`;

//     binds = [ [101, "Alpha" ], [102, "Beta" ], [103, "Gamma" ] ];

//     // For a complete list of options see the documentation.
//     options = {
//       autoCommit: true,
//       // batchErrors: true,  // continue processing even if there are data errors
//       bindDefs: [
//         { type: oracledb.NUMBER },
//         { type: oracledb.STRING, maxSize: 20 }
//       ]
//     };

//     result = await connection.executeMany(sql, binds, options);

    
//     console.log("Number of rows inserted:", result.rowsAffected);

//     // Query the data

//     sql = `SELECT * FROM mytab`;

//     binds = {};

//     // For a complete list of options see the documentation.
//     options = {
//       outFormat: oracledb.OBJECT   // query result format
//       // extendedMetaData: true,   // get extra metadata
//       // fetchArraySize: 100       // internal buffer allocation size for tuning
//     };

//     result = await connection.execute(sql, binds, options);

//     console.log("Column metadata: ", result.metaData);
//     console.log("Query results: ");
//     console.log(result.rows);

//     // Show the date.  The value of ORA_SDTZ affects the output

//     sql = `SELECT TO_CHAR(CURRENT_DATE, 'DD-Mon-YYYY HH24:MI') AS CD FROM DUAL`;
//     result = await connection.execute(sql, binds, options);
//     console.log("Current date query results: ");
//     console.log(result.rows[0]['CD']);

//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }

// run();