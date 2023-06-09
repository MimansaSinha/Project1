
const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');


router.post('/', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;

   
    try {
        const {user_id,pin,login_pin} = req.body;
        sqlQuery = `SELECT login_pin FROM tbl_login WHERE user_id = $1`
        console.log("1st api called")
         result = await db.query( sqlQuery, [user_id] );
        const existingPin = result.rows[0].login_pin;
         
        if(existingPin == pin){
            sqlQuery = `UPDATE tbl_login SET login_pin = $1 WHERE user_id = $2`
            result = await db.query( sqlQuery, [login_pin, user_id] );
            console.log("2nd api called")
            res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'true',
                response: null,
                data: result.rows
            });
        }else{
            res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'false',
                response: null,
                data: result.rows
            });
        }
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