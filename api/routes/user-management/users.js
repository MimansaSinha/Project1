const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = "SELECT a.user_id,a.city_id, a.state_id,a.country,a.pincode, a.created_on, a.created_by, a.modified_On, a.modified_by,a.erp_code, a.user_group_name,CONCAT(a.first_name , ' ' , a.last_name) AS Name,a.address ,b.city_name,c.mobile,'Kaushal.kumar' AS reporting_to,a.enabled FROM tbl_users a INNER JOIN tbl_city b ON a.city_id = b.city_id INNER JOIN tbl_login c ON a.user_id=c.user_id ORDER BY a.user_id ASC";
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