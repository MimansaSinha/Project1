const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        const { zone_id,vendor_type, order_date_from, order_date_to} = req.body
        sqlQuery = "SELECT  SUM(h.rounded_amount) AS total_amount FROM tbl_vendor AS v JOIN tbl_order_header AS h ON v.vendor_id = h.seller_id WHERE v.zone_id = $1 AND v.vendor_type = $2 AND h.order_date BETWEEN $3 AND $4 GROUP BY v.zone_id, v.vendor_type";
        result = await db.query(sqlQuery,[zone_id,vendor_type,order_date_from,order_date_to]);
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