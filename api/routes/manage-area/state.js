const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = "SELECT a.state_id,b.zone_id,b.zone_name,a.state_name, TO_CHAR(DATE(a.created_on),'dd-mm-yyyy') as created_on, a.created_by,  a.enabled FROM tbl_state a INNER JOIN tbl_zone b ON a.zone_id = b.zone_id ORDER BY a.state_id ASC";
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
                    const { state_name, zone_id,erp_code } = req.body
                    sqlQuery = `INSERT INTO tbl_state(state_id,zone_id,state_name,created_on,created_by,enabled,erp_code) VALUES (CONCAT('STA',(select count(*) from tbl_state)+1),$1,$2,$3,$4,$5,$6) RETURNING *`
                    var Result = await db.query(sqlQuery,[zone_id,state_name,createdOn,createdBy,enabled,erp_code])
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

router.put('/:state_id', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;

    try {
        // if(result){
            const now  =  new Date();
                    var modifiedOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                    // var modified_by = 'piyush'
                    var enabled = true
                    const { zone_id,state_name,modified_by,erp_code} = req.body
                    console.log(zone_id)
                    console.log(state_name)

                    var checkQuery = "SELECT * FROM tbl_state WHERE zone_id = $1 and state_name = $2"
                    var checkresult =  await db.query(checkQuery,[zone_id,state_name ])
                    if (checkresult.rowCount > 0) {
                        return   res.json({
                            status: 'already',
                            code: fn.apiSuccessResponseCode,
                            success: 'true',
                            response: 'state name alery exists',
                            data: 'state name alery exists'
                        })
                    }else{
                        sqlQuery = "UPDATE tbl_state SET zone_id = $1, state_name = $2, modified_on = $3, modified_by = $4, enabled = $5, erp_code = $6 WHERE state_id ='"+req.params.state_id+"'"
                    var result = await db.query(sqlQuery,[zone_id,state_name,modifiedOn,modified_by,enabled,erp_code])
                    }
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

queryPromise1 = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT zone_id,zone_name FROM tbl_zone ORDER BY zone_name',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};
queryPromise2 = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('query2',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

module.exports = router;