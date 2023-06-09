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
        sqlQuery = "SELECT a.area_id,b.state_name,c.city_name,a.area_name,a.state_id, a.city_id , TO_CHAR(DATE(a.created_on),'dd-mm-yyyy') as created_on, a.created_by,  a.enabled FROM tbl_area a INNER JOIN tbl_state b ON a.state_id = b.state_id INNER JOIN tbl_city c ON a.city_id = c.city_id ORDER BY a.area_id ASC";
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
                        const { area_name,city_id,state_id,erp_code } = req.body
                        sqlQuery = `INSERT INTO tbl_area(area_id,city_id,state_id,area_name,created_on,created_by,enabled,erp_code) VALUES (CONCAT('ARE',(select count(*) from tbl_area)+1),$1,$2,$3,$4,$5,$6,$7) RETURNING *`
                        result = await db.query(sqlQuery,[city_id,state_id,area_name,createdOn,createdBy,enabled,erp_code])
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

    router.put('/:area_id', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
        try {
            // if(result){
                const now  =  new Date();
                        var modifiedOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                        // var modified_by = 'piyush'
                        var enabled = true
                        const { area_id,state_id,city_id,area_name ,modified_by,erp_code} = req.body
                        console.log(area_id)
                        console.log(area_name)
                        console.log(state_id)
                        console.log(city_id)

                       var checkQuery = "SELECT * FROM tbl_area WHERE state_id = $1 and city_id = $2 and area_name = $3"
                        var checkresult =  await db.query(checkQuery,[state_id, city_id,area_name ])
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
                            sqlQuery = "UPDATE tbl_area SET state_id = $1, city_id = $2,area_name = $3 ,modified_on = $4, modified_by = $5, enabled = $6, erp_code = $7 WHERE area_id ='"+req.params.area_id+"'"
                            var result = await db.query(sqlQuery,[state_id, city_id, area_name ,modifiedOn,modified_by,enabled,erp_code])
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