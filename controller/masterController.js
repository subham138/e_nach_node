// VARIABLE & MODULE INITIALIZATION
const db_details = require("../db/conString"),
  oracledb = require("oracledb"),
  path = require("path");

//   console.log(path.join(__dirname, "../instantclient"));

try {
  oracledb.initOracleClient({
    libDir: "E:\\Projects\\e_nach_api\\instantclient", //path.join(__dirname, 'instantclient'), //"C:\\inetpub\\vhosts\\opentech4u.co.in\\restaurantapi\\instantclient"
  });
} catch (err) {
  console.error("Whoops!");
  console.error(err);
  process.exit(1);
}

oracledb.autoCommit = true;
// END

// FUNCTION FOR EXICUTE SELECT QUERY AND RETURN RESULT
const F_Select = (pax_id, fields, table_name, where, order, flag) => {
  return new Promise(async (resolve, reject) => {
    where = where ? `WHERE ${where}` : "";
    order = order ? order : "";
    // console.log(db_details[pax_id]);

    // CREATE DB CONNECTION
    const pool = await oracledb.createPool(db_details[pax_id]);
    const con = await pool.getConnection();
    // END
    // SQL QUERY
    let sql = `SELECT ${fields} FROM ${table_name} ${where} ${order}`;
    // console.log(sql);

    // EXICUTE QUERY
    const result = await con.execute(sql, [], {
      resultSet: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    // END

    // STORE RESULT SET IN A VARIABLE
    let rs = result.resultSet;
    // console.log(rs);

    // RETURN RESULT SET AS USER'S REQUIREMENT
    var data = flag > 0 ? await rs.getRows() : await rs.getRow(); // 0-> Single DataSet; 1-> Multiple DataSet
    // console.log(await rs.getRows());
    // END

    // CLOSE CONNECTION
    await con.close();
    await pool.close();
    // END
    data =
      flag > 0
        ? data.length > 0
          ? { suc: 1, msg: data }
          : { suc: 0, msg: "No Data Found" }
        : data
        ? { suc: 1, msg: data }
        : { suc: 0, msg: "No Data Found" };
    resolve(data);
  });
};

// FUNCTION FOR INSERT DATA TO DATABASE
const F_Insert = (pax_id, table_name, fields, val, values, where, flag) => {
  return new Promise(async (resolve, reject) => {
    // CREATE DB CONNECTION
    const pool = await oracledb.createPool(db_details[pax_id]);
    const con = await pool.getConnection();
    // END

    // SQL QUERY
    const sql =
      flag > 0
        ? `UPDATE ${table_name} SET ${fields} WHERE ${where}`
        : `INSERT INTO ${table_name} (${fields}) VALUES (${val})`; // 0-> INSERT NEW DATA; 1-> UPDATE TABLE DATA
    // console.log(sql);

    try {
      // EXICUTE QUERY AND RETURN RESULT
      if (flag > 0){
        // Adjust values array to ensure dates are bound correctly
        const bindVars = values.map((value, index) => {
          if (index === 3) {
            // Assuming date values are at these indexes
            return { val: new Date(value), type: oracledb.DATE };
          }
          return value;
        });
        if (await con.execute(sql, bindVars, { autoCommit: true })) {
          res_data = { suc: 1, msg: "success" };
        } else {
          res_data = { suc: 0, msg: "err" };
        }
      }else{
        // Adjust values array to ensure dates are bound correctly
        const bindVars = values.map((value, index) => {
          if (index === 9 || index === 12) {
            // Assuming date values are at these indexes
            return { val: new Date(value), type: oracledb.DATE };
          }
          return value;
        });
        if (await con.execute(sql, bindVars, { autoCommit: true })) {
          res_data = { suc: 1, msg: "success" };
        } else {
          res_data = { suc: 0, msg: "err" };
        }
      }
      await con.close();
      await pool.close();
      resolve(res_data);
    } catch (err) {
      console.log(err);
      await con.close();
      await pool.close();
      resolve({ suc: 0, msg: err });
    }
  });
};

module.exports = { F_Select, F_Insert };
