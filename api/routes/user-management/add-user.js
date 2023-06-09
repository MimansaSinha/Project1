
const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');
const fs = require('fs')
const fse = require('fs-extra');


// Api to upload photos
router.post('/add', (req, res) => {
    console.log("api called");
    var path = __dirname + '/documents/temp' + '/' + req.body.filename;
    //    console.log (req.body.filename);
    var image = req.body.file;
    //    console.log (image);
    var data = image.split(',')[1];
    //    console.log (data);
    fs.writeFileSync(path, data, { encoding: 'base64' });
    res.json({ msg: 'success' });
});


router.post('/upload', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
   
     console.log("api called")
    try {
        var sqlquery = `SELECT COUNT(*) FROM tbl_users`
        var Result = await db.query(sqlquery);
        var RecCount = Result.rows[0].count
        var userId = parseInt(RecCount) + 1

        // moving user_photo to USERS folder
        if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.user_photo)) {
            var src = __dirname + '/documents/temp' + '/' + req.body.user_photo
            var dest = __dirname + '/documents/USER' + userId + '/' + req.body.user_photo
            fse.move(src, dest, (err) => {
                if (err) return console.log(err);
                console.log(`File successfully moved!!`);
            });
            console.log('File exists');
        }

        var userPhotoUrl = 'user-management/documents/USER' + userId + '/' + req.body.shop_logo

        const { user_group_id,user_group_name,first_name,last_name, address, city_id, state_id, country,pincode, created_by, erp_code } = req.body;
        const enabled = true
        const created_on = new Date().toLocaleDateString();
        const date_of_joining  = new Date().toLocaleDateString();
        console.log("api called")
        sqlQuery = `INSERT INTO tbl_users (user_id,user_group_id,user_group_name,first_name, last_name, address, city_id,state_id, country, pincode, date_of_joining,user_photo,created_on, created_by,enabled, erp_code )
        VALUES (CONCAT('USR', (SELECT COUNT(*) FROM tbl_users) + 1), $1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11,$12,$13,$14, $15)
        RETURNING *`
        console.log("api called")
         result = await db.query( sqlQuery, [user_group_id, user_group_name, first_name, last_name, address, city_id, state_id, country,pincode, date_of_joining, userPhotoUrl,created_on, created_by,enabled, erp_code,] );
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

router.put('/:user_id', async (req, res) => {
    var sqlQuery;
    var sql_Query;
    var resCode = 0;
    var result;
    var Result;

    try {
        // if(result){
            const now  =  new Date();
                   var modified_on = date.format(now,'YYYY/MM/DD HH:mm:ss');
                   var action_on = date.format(now,'YYYY/MM/DD HH:mm:ss');
                    console.log('runs')
                    // var modified_by = 'piyush'
                    var enabled = true
                    const { user_id,user_group_id,user_group_name,first_name,last_name,address ,state_id, city_id, country, pincode, mobile, email, reporting_officer_id,modified_by,erp_code} = req.body
                        sqlQuery = "UPDATE tbl_users SET user_id=$1, user_group_id = $2, user_group_name = $3, first_name = $4, last_name=$5, address=$6,state_id=$7,city_id=$8, country=$9,pincode=$10,modified_on=$11 ,modified_by=$12, enabled=$13, erp_code = $14 WHERE user_id ='"+req.params.user_id+"'"
                        var result = await db.query(sqlQuery,[user_id,user_group_id,user_group_name,first_name,last_name, address,state_id,city_id , country,pincode , modified_on,modified_by,enabled,erp_code])
                        console.log('success1')
                        sql_Query = "UPDATE tbl_login SET user_id=$1, user_group_id = $2, mobile=$3, email=$4, reporting_officer_id=$5, modified_on=$6, modified_by=$7, enabled=$8, erp_code = $9 WHERE user_id ='"+req.params.user_id+"'"
                        var Result = await db.query(sql_Query,[user_id,user_group_id,mobile, email, reporting_officer_id, modified_on,modified_by,enabled,erp_code])
                        console.log('success2')

                  return   res.json({
                    status: 'ok',
                    code: fn.apiSuccessResponseCode,
                    success: 'true',
                    response: result.rows,
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

module.exports = router;