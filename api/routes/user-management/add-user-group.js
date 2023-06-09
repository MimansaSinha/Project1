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
        sqlQuery = "SELECT DISTINCT entity_belong_to FROM tbl_user_group;";
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

router.post('/add', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
   
     console.log("api called")
    try {
        const { entity_belong_to, group_name, hierarchy, created_by, erp_code } = req.body;
        const enabled = true
        const created_on = new Date().toLocaleDateString();
        console.log("api called")
        sqlQuery = `INSERT INTO tbl_user_group (user_group_id, entity_belong_to, group_name, hierarchy, created_on, created_by, erp_code, enabled)
        VALUES (CONCAT('UGR', (SELECT COUNT(*) FROM tbl_user_group) + 1), $1, $2, $3, $4, $5, $6,$7)
        RETURNING *`
        console.log("api called")
         result = await db.query( sqlQuery, [entity_belong_to, group_name, hierarchy, created_on, created_by, erp_code,enabled] );
         res.json({
            status: 'ok',
            code: fn.apiSuccessResponseCode,
            success: 'true',
            response: null,
            data: result.rows
        });
        console.log("api called")

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

router.put('/:user_group_id', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;

    try {
        // if(result){
            const now  =  new Date();
                   var modified_on = date.format(now,'YYYY/MM/DD HH:mm:ss');
                   var action_on = date.format(now,'YYYY/MM/DD HH:mm:ss');
                    console.log('runs')
                    // var modified_by = 'piyush'
                    var enabled = true
                    const { user_group_id, group_name,entity_belong_to,hierarchy,modified_by,erp_code} = req.body
                        sqlQuery = "UPDATE tbl_user_group SET user_group_id = $1, entity_belong_to = $2, group_name = $3, hierarchy=$4, modified_on=$5,modified_by=$6, enabled=$7, erp_code = $8 WHERE user_group_id ='"+req.params.user_group_id+"'"
                        var result = await db.query(sqlQuery,[user_group_id,entity_belong_to,group_name,hierarchy,modified_on,modified_by,enabled,erp_code])
                        console.log('success')
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