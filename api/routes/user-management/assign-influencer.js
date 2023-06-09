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
        sqlQuery = "SELECT a.influencer_id, a.influencer_name, a.influencer_type,b.city_name,'Pankaj.Tanwar' as assigned_to, a.enabled FROM tbl_influencer a INNER JOIN tbl_city b ON a.city_id=b.city_id ORDER BY a.influencer_id ASC";
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


    router.post('/add',async(req,res) =>{

        var sqlQuery;
        var result;
    
        try{
            const now = new Date();
            var created_on = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            var enabled = true
            sqlQuery="INSERT INTO tbl_influencer_staff_mapping(influencer_id, user_id, created_on, created_by,enabled, erp_code) VALUES ('"+req.body.influencer_id+"', '"+req.body.user_id+"', '"+created_on+"','"+req.body.created_on+"' , '"+enabled+"', '"+req.body.erp_code+"')"
            result = await db.query(sqlQuery)
            res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'true',
                response: null,
                data: result.rows
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
module.exports = router;