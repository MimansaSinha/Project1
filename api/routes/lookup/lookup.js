const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
// var dateTime = require('node-datetime');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');
const { json } = require('body-parser');

// API to get all records of lookup table

router.get('/', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;   
    try {
        sqlQuery = `SELECT element FROM tbl_lookup WHERE parent_lookup_id = 1`
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

router.get('/status', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;   
    try {
        sqlQuery = `SELECT element FROM tbl_lookup WHERE parent_lookup_id = 27`
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



