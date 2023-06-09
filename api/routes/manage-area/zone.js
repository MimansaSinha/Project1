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

// API to get all records of zone table
router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = "SELECT zone_id, zone_name, TO_CHAR(DATE(created_on),'dd-mm-yyyy') as created_on, created_by,  enabled FROM tbl_zone ORDER BY zone_id ASC";
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


    // get data by id

    router.get('/:zone_id', async(req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
        try {
            var zone_id = req.params.zone_id
            sqlQuery = "SELECT zone_id, zone_name, TO_CHAR(DATE(created_on),'dd-mm-yyyy') as created_on, created_by,modified_on,modified_by,enabled,erp_code FROM tbl_zone WHERE zone_id = '"+zone_id+"' ORDER BY zone_id ASC";
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



    router.post('/add2', async(req,res) => {
        var sqlQuery;
        var rescode = 0;
        var result;

        try{

            sqlQuery = "SELECT zone_name FROM tbl_zone WHERE zone_name ='" + req.body.zone_name + "'";
            result = await db.query(sqlQuery);
            console.log(req.body.zone_name)
             if(result.rows.length>0){
                res.json({
                    status: 'ok',
                    code: fn.apiSuccessResponseCode,
                    success: 'true',
                    response: null,
                    data: result.rows
                });
                console.log("2");
             }

            else{
            console.log('api called')
          
            const now  =  new Date();
            var createdOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
            // var dt = dateTime.create();
            // var createdOn = dt.format('d-m-Y H:M:S');
            console.log(createdOn)
            var createdBy ='Kaushal Kumar'
            var enabled = true
            const {zone_name,erp_code} = req.body
            sqlQuery = `INSERT INTO tbl_zone(zone_id,zone_name,created_on,created_by,enabled,erp_code) VALUES (CONCAT('ZON',(select count(*) from tbl_zone)+1),$1,$2,$3,$4,$5) RETURNING *`
            result = await db.query(sqlQuery,[zone_name,createdOn,createdBy,enabled,erp_code]);
            console.log(req.body)
           console.log(sqlQuery)
           res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
    }
        }catch (err) {
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
        }
    })

    // comment for checking git

    

module.exports = router;