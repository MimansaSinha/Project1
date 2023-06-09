const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals.js');

router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = `
        SELECT t1.inventory, t2.vendor_id, t2.vendor_name, t3.product_id, t3.product_name
        FROM tbl_inventory t1
        INNER JOIN tbl_vendor t2 ON t1.distributor_id = t2.vendor_id
        INNER JOIN tbl_product t3 ON t1.product_id = t3.product_id
        WHERE t2.vendor_type = 'Retailer'
        `;
        result = await db.query(sqlQuery);
        res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
        // console.log("called");
    } catch (err) {
    var errResponse = [];
    var eRes = {
       code: err.code,
        message: err.message
    };
    errResponse.push(eRes)
    res.json({
        status: 'ok',
        code: fn.apiErrorResponseCode,
        success: 'false',
        response: errResponse,
        data: null
    });
    // console.log(fn.apiErrorResponseCode);
    // console.error(err);
    // res.json(err);
}
        // console.log(result.rows[0].count);
    
    }); 

module.exports = router;