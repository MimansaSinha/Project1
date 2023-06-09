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
        sqlQuery = "SELECT a.beat_id, a.beat_name,a.beat_type, b.state_name,c.city_name,a.status,a.action_by,a.enabled,a.erp_code,a.created_by,TO_CHAR(DATE(a.created_on),'dd-mm-yyyy') as created_on,a.modified_on,a.modified_by FROM tbl_beat a INNER JOIN tbl_state b ON a.state_id=b.state_id INNER JOIN tbl_city c ON a.city_id=c.city_id ORDER BY a.beat_id ASC";
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


    router.put('/:beat_id', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
        try {
            // if(result){
            const now = new Date();
            var action_on = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            // var modified_by = 'piyush'
            var enabled = true
            const { status, action_by, comment } = req.body
    
            sqlQuery = " UPDATE tbl_beat SET status=$1, action_on=$2, action_by=$3, comment=$4 WHERE beat_id='" + req.params.beat_id + "'"
            var result = await db.query(sqlQuery, [status, action_on, action_by, comment])
            return res.json({
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