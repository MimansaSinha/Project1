const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        
        sqlQuery = "SELECT beat_id,beat_name,beat_type, TO_CHAR(DATE(visit_date),'dd-mm-yyyy') as visit_date,enabled,approved,TO_CHAR(DATE(approved_on),'dd-mm-yyyy') as approved_on FROM tbl_beat_assignment WHERE user_id IS NULL AND approved = true ORDER BY  beat_id ASC";
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


    router.get('/user',async(req,res)=>{
    var sqlOuery;
    var result;

    try{

        sqlOuery="SELECT user_id,CONCAT(first_name,' ',last_name) AS user_name FROM tbl_users";
        result = await db.query(sqlOuery)
        res.json({
            staus:'ok',
            code:fn.apiSuccessResponseCode,
            success:'true',
            response:null,
            data:result.rows

        })

    }catch(err){
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


    router.put('/:beat_id',async(req,res) => {
        var sqlOuery;
        var result;

        try{
            const now = new Date();
            var approved_on = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            var approved = true;
            var enabled = true
            sqlOuery ="UPDATE tbl_beat_assignment SET user_id='"+req.body.user_id+"',approved_by='"+req.body.approved_by+"',approved_on='"+approved_on+"',assigned_by='"+req.body.assigned_by+"' WHERE beat_id ='" + req.params.beat_id + "'";
            result = await db.query(sqlOuery)
            res.json({
                status:'ok',
                code:fn.apiSuccessResponseCode,
                success :'true',
                response:null,
                data:result
            })
        }catch(err){
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
    // SELECT a.beat_id, a.beat_name,a.beat_type, TO_CHAR(DATE(visit_date),'dd-mm-yyyy') as visit_date,CONCAT(b.first_name,' ',b.last_name) AS assigned_to,CONCAT(c.first_name,' ' ,c.last_name) AS assigned_by,CONCAT(d.first_name,' ' ,d.last_name) AS approved_by,a.enabled,a.approved,TO_CHAR(DATE(approved_on),'dd-mm-yyyy') as approved_on FROM tbl_beat_assignment a INNER JOIN tbl_users b ON a.user_id=b.user_id INNER JOIN tbl_users c ON a.assigned_by=c.user_id INNER JOIN tbl_users d ON a.approved_by=d.user_id WHERE a.user_id IS NULL ORDER BY  beat_id ASC

module.exports = router;