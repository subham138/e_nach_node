const { F_Select, F_Insert } = require('../controller/masterController');

const ApiRouter = require('express').Router()

ApiRouter.post("/get_res", async (req, res) => {
    var data = req.body.data
    var res_dt = await F_Select(1, data.select, data.table_name, data.where, data.order, data.flag);
    res.send(res_dt)
});

ApiRouter.post("/data_insert", async (req, res) => {
    var data = req.body.data
    console.log(data);
    // console.log(new Date(fld[0].split('=')[1].trim()));
    // fld[0].split("=")[1] = new Date(fld[0].split("=")[1].trim());
    // fld = fld.join("=");
    // data.fields
    var res_dt = await F_Insert(1, data.table_name, data.fields, data.val, data.values, data.whr, data.flag);
    console.log(res_dt);
    res.send(res_dt);
});

module.exports = {ApiRouter}