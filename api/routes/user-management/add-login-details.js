
const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals.js');


router.post('/', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
   
     console.log("api called")
    try {
        const { user_group_id,mobile,login_pin,email, reporting_officer_id, created_by, erp_code } = req.body;
        const enabled = true
        const created_on = new Date().toLocaleDateString();
        console.log("api called")
        sqlQuery = `INSERT INTO tbl_login (user_id,user_group_id,mobile,login_pin, email, reporting_officer_id, created_on, created_by,enabled, erp_code )
        VALUES (CONCAT('USR', (SELECT COUNT(*) FROM tbl_login) + 1), $1, $2, $3, $4, $5, $6,$7,$8,$9)
        RETURNING *`
        console.log("api called")
         result = await db.query( sqlQuery, [user_group_id, mobile, login_pin, email, reporting_officer_id,created_on, created_by, enabled,erp_code] );
         res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
        console.log("api called")

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
    }

})

module.exports = router;