const express = require('express');
const router = express.Router();
var db = require('../../config/db.js');

var path = require('path');
var geoip = require('geoip-lite');
//var dateTime = require('node-datetime');
// Adding custom library to access custom global variables

var fn = require('../../library/globals');

// API to authenticate user
// Paramaeters used are 'username' (string) and 'pin' (string)
router.post('/', async (req, res) => {
    // console.log(req.body.username);
    var sqlQuery;
    var resCode = 0;
    var result;
    // console.log(sqlQuery);       
    try {
        sqlQuery = "SELECT COUNT(*) FROM tbl_login WHERE UPPER(user_id)  = '" + req.body.username.toUpperCase() + "' AND login_pin = '" + req.body.pin + "' AND enabled = true";
        result = await db.query(sqlQuery);
        // console.log(result.rows[0].count);
        //If username and pin match and user is enabled.
        if (result.rows[0].count > 0)
            resCode = fn.apiSuccessResponseCode;
        else
        //If username and pin does not match then checking username first   
        {
            sqlQuery = "SELECT COUNT(*) FROM tbl_login WHERE UPPER(user_id)  = '" + req.body.username.toUpperCase() + "'";
            result = await db.query(sqlQuery);
            //if username is not found
            if (result.rows[0].count < 1)
                resCode = 401;
            else
            // If username is not found then checking pin
            {
                sqlQuery = "SELECT COUNT(*) FROM tbl_login WHERE UPPER(user_id)  = '" + req.body.username.toUpperCase() + "' AND login_pin = '" + req.body.pin + "'";
                result = await db.query(sqlQuery);
                //if username is found but pin is not found
                if (result.rows[0].count < 1)
                    resCode = 402;
                else
                    //If username and pin found, it means user is not enabled/active
                    resCode = 403;
            }

        }

        // if user login is failed then fetching reason from db based on 'resCode'
        if (resCode != fn.apiSuccessResponseCode) {
            sqlQuery = "SELECT code, message FROM tbl_custom_error WHERE code=" + resCode;
            result = await db.query(sqlQuery);
            res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'false',
                response: result.rows,
                data: null
            });
        }
        // if login is successfull then fetching required user info
        else
        {
            sqlQuery = "SELECT t1.user_id,t1.mobile,t1.email,t1.reporting_officer_id,t2.entity_belong_to,t2.group_name,t2.hierarchy, t3.first_name, t3.last_name FROM tbl_login t1 INNER JOIN tbl_user_group t2 on t1.user_group_id = t2.user_group_id INNER JOIN tbl_users t3 on t1.user_id = t3.user_id WHERE t1.user_id  = '" + req.body.username.toUpperCase() + "'";
            result = await db.query(sqlQuery);
            res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'true',
                response: null,
                data: result.rows
            });

        }


        // res.json(zone.rows);

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

});
module.exports = router;

// https://dirask.com/posts/Node-js-PostgreSQL-COUNT-pamQKp