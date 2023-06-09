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
        sqlQuery = "SELECT a.beat_id,b.state_name,c.city_name,a.beat_name,a.beat_type,a.state_id, a.city_id,a.created_on, a.created_by ,'YES' AS approved,a.enabled FROM tbl_beat a INNER JOIN tbl_state b ON a.state_id = b.state_id INNER JOIN tbl_city c ON a.city_id = c.city_id ORDER BY a.beat_id ASC";
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
                const now  =  new Date();
                        var createdOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                        var enabled = true

                        const { beat_name,beat_type,state_id,city_id,created_by} = req.body
                        sqlQuery = `SELECT COUNT(*) FROM tbl_beat`
                        result = await db.query(sqlQuery);
                        var RecCount = result.rows[0].count
                        var BeatId = parseInt(RecCount) + 1
                        console.log(BeatId)
                        console.log(req.body)
                        console.log(req.body.beat_lines.length)

                        sqlQuery = `INSERT INTO tbl_beat(beat_id,beat_name,beat_type,state_id,city_id,created_on,created_by,enabled) VALUES (CONCAT('BET',${BeatId}),$1,$2,$3,$4,$5,$6,$7) RETURNING *`
                        result = await db.query(sqlQuery,[beat_name,beat_type,state_id,city_id,createdOn,created_by,enabled])
                        if(req.body.beat_lines.length>0){
                            
                            for(let i = 0; i<req.body.beat_lines.length; i++){
                                const {area_id,vendor_id,vendor_name,vendor_type} = req.body.beat_lines[i]
                                sqlQuery = `INSERT INTO tbl_beat_lines(beat_id,state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,created_on,created_by,enabled) VALUES (CONCAT('BET',${BeatId}),$1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`
                                result = await db.query(sqlQuery,[state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,createdOn,created_by,enabled])
                            }
            
                          return   res.json({
                            status: 'ok',
                            code: fn.apiSuccessResponseCode,
                            success: 'true',
                            response: null,
                            data: result.rows
                        })
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

    router.put('/:beat_id', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
        try {
            // if(result){
                const now  =  new Date();
                        var modifiedOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                        // var modified_by = 'piyush'
                        var enabled = true
                        const { beat_id,beat_name, beat_type, approved,approved_by, state_id,city_id,modified_by,erp_code} = req.body
                        console.log(beat_id)
                        console.log(beat_name)
                        console.log(beat_type)
                        console.log(approved)
                        console.log(state_id)
                        console.log(city_id)

                       var checkQuery = "SELECT * FROM tbl_beat WHERE beat_id = $1 AND state_id = $2 AND city_id = $3 AND beat_name = $4"
                        var checkresult =  await db.query(checkQuery,[beat_id, state_id, city_id,beat_name ])
                           console.log('check runs')
                        if (checkresult.rowCount > 0) {
                            return   res.json({
                                status: 'already',
                                code: fn.apiSuccessResponseCode,
                                success: 'true',
                                response: 'beat name alerdy exists',
                                data: 'beat name alery exists'
                            })
                        }else{
                            sqlQuery = "UPDATE tbl_beat SET beat_id = $1 , beat_name = $2, beat_type=$3,state_id=$4, city_id = $5, approved=$6, approved_on=$7, approved_by=$8 ,modified_on=$9, modified_by=$10, enabled=$11, erp_code = $12 WHERE beat_id ='"+req.params.beat_id+"'"
                            var result = await db.query(sqlQuery,[beat_id, beat_name, beat_type,state_id, city_id,approved,modifiedOn, approved_by ,modifiedOn,modified_by,enabled,erp_code])
                            console.log('success')
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


//    if(result.rows.length>0){
//         // const { state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,created_by,erp_code } = req.body
//         // sqlQuery = `INSERT INTO tbl_beat_lines(beat_id,state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,created_on,created_by,enabled,erp_code) VALUES (CONCAT('BET',(select count(*) from tbl_beat)+1),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
//         // result = await db.query(sqlQuery,[state_id,city_id,area_id,vendor_id,vendor_name,vendor_type,createdOn,created_by,enabled,erp_code])
//       return   res.json({
//         status: 'ok',
//         code: fn.apiSuccessResponseCode,
//         success: 'true',
//         response: null,
//         data: result.rows
//     })
//     }