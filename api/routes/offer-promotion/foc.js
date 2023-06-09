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
        SELECT 
    t2.product_name,
    t3.product_name as parent_product_name,
    t1.parent_item_qty,
    t1.foc_item_qty,
    t1.unit_price,
    TO_CHAR(DATE(effective_from),'dd-mm-yyyy') as effective_from,
    ('24-03-2023') as effective_to,
    t1.enabled
    FROM tbl_foc t1
    JOIN tbl_product t2 ON t1.parent_product_id = t2.product_id
    JOIN tbl_product t3 ON t1.foc_item_id = t3.product_id;
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