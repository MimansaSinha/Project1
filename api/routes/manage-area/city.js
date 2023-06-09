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
        sqlQuery = "SELECT a.city_id,b.state_id,b.state_name,a.city_name, TO_CHAR(DATE(a.created_on),'dd-mm-yyyy') as created_on, a.created_by,  a.enabled FROM tbl_city a INNER JOIN tbl_state b ON a.state_id = b.state_id ORDER BY a.city_id ASC";
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

    router.post('/add', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
        try {
            // if(result){
                const now  =  new Date();
                        var createdOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                        var createdBy = 'Kaushal Kumar'
                        var enabled = true
                        const { city_name,state_id,erp_code } = req.body
                        sqlQuery = `INSERT INTO tbl_city(city_id,state_id,city_name,created_on,created_by,enabled,erp_code) VALUES (CONCAT('CTY',(select count(*) from tbl_city)+1),$1,$2,$3,$4,$5,$6) RETURNING *`
                        var Result = await db.query(sqlQuery,[state_id,city_name,createdOn,createdBy,enabled,erp_code])
                      return   res.json({
                        status: 'ok',
                        code: fn.apiSuccessResponseCode,
                        success: 'true',
                        response: null,
                        data: Result.rows
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

    router.put('/:city_id', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
        try {
            // if(result){
                const now  =  new Date();
                        var modifiedOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                        // var modified_by = 'piyush'
                        var enabled = true
                        const { city_id,city_name,state_id ,modified_by,erp_code} = req.body
                        console.log(city_id)
                        console.log(city_name)
                        console.log(state_id)

                       var checkQuery = "SELECT * FROM tbl_city WHERE state_id = $1 and city_name = $2"
                        var checkresult =  await db.query(checkQuery,[state_id,city_name ])
                           console.log('check runs')
                        if (checkresult.rowCount > 0) {
                            return   res.json({
                                status: 'already',
                                code: fn.apiSuccessResponseCode,
                                success: 'true',
                                response: 'city name alery exists',
                                data: 'city name alery exists'
                            })
                        }else{
                            sqlQuery = "UPDATE tbl_city SET city_id = $1,state_id = $2, city_name = $3, modified_on = $4, modified_by = $5, enabled = $6, erp_code = $7 WHERE city_id ='"+req.params.city_id+"'"
                            var result = await db.query(sqlQuery,[city_id,state_id,city_name ,modifiedOn,modified_by,enabled,erp_code])
                        }
                      return   res.json({
                        status: 'ok',
                        code: fn.apiSuccessResponseCode,
                        success: 'true',
                        response: result.rows,
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