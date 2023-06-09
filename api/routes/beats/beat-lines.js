const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
// var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals.js');

// API to get all records of zone table
router.get('/:city_id', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        // const city_id = 
       
        sqlQuery = "SELECT a.vendor_id,a.vendor_name,a.vendor_type,b.area_name,a.enabled FROM tbl_vendor a INNER JOIN tbl_area b ON a.area_id=b.area_id WHERE a.city_id='"+ req.params.city_id+"'";
        result = await db.query(sqlQuery);
        console.log(sqlQuery)
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

    router.post('/add', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
        try {
            // if(result){
                const now  =  new Date();
                        var createdOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                        var enabled = true
                        const { state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,created_by,erp_code } = req.body
                        sqlQuery = `INSERT INTO tbl_beat_lines(beat_id,state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,created_on,created_by,enabled,erp_code) VALUES (CONCAT('BET',(select count(*) from tbl_beat)+1),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
                        result = await db.query(sqlQuery,[state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,createdOn,created_by,enabled,erp_code])
                      return   res.json({
                        status: 'ok',
                        code: fn.apiSuccessResponseCode,
                        success: 'true',
                        response: null,
                        data: result.rows
                    })
            
    
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