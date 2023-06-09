const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

router.post('/:state_id/:city_id/:vendor_type', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;   
    try {
         const {state_id, city_id,vendor_type} = req.params;
        sqlQuery = "SELECT  DISTINCT (vendor_category)  FROM tbl_vendor WHERE state_id ='"+req.params.state_id+"' and city_id = '"+req.params.city_id+"' and vendor_type = '"+req.params.vendor_type+"' and vendor_category != 'null'"
        console.log("1st api called")
         result = await db.query( sqlQuery );
         res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
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

router.post('/:state_id/:city_id/:vendor_type/:vendor_category', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;   
    try {
         const {state_id, city_id,vendor_type,vendor_category} = req.params;
         sqlQuery = "SELECT vendor_id FROM tbl_vendor WHERE state_id ='"+req.params.state_id+"' and city_id = '"+req.params.city_id+"'  and vendor_type = '"+req.params.vendor_type+"' and vendor_category = '"+req.params.vendor_category+"'"
        console.log("1st api called")
         result = await db.query( sqlQuery );
         res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
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


router.get('/lookup', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;   
    try {
        sqlQuery = `SELECT element FROM tbl_lookup WHERE parent_lookup_id = 1`
        console.log("1st api called")
         result = await db.query( sqlQuery );
         res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
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