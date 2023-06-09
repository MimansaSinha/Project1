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
router.post('/', (req, res) => {
    var sqlQuery = "SELECT role FROM users WHERE username = '" + req.body.username + "' AND pin = crypt('" + req.body.pin + "', pin) AND enabled = true";
    db(sqlQuery, (error, results, fields) => {   
        if (!error) {
            // console.log("API Called.");
            if (results.rows.length > 0) {
                // console.log(results.rows);
                fn.getCustomErrResponse(200).then((result) => {
                    res.status(200).json({
                        status: 'ok',
                        code: 200,
                        success: 'true',
                        response: result,
                        data: results.rows
                    });
                }).catch((result) => {
                    res.status(200).json({
                        status: 'ok',
                        code: 200,
                        success: 'true',
                        response: result,
                        data: []
                        //    console.log('error occured')
                    });
                })


            }
            // If username or password does not match in db or user is not active
            else {
                // Checking username now
                var sqlQuery = "SELECT role FROM users WHERE username = '" + req.body.username + "'";
                db(sqlQuery, (error, results, fields) => {
                    // If username not found
                    if (results.rows.length < 1) {
                        fn.getCustomErrResponse(401).then((result) => {
                            res.status(200).json({
                                status: 'ok',
                                code: 200,
                                success: 'true',
                                response: result,
                                data: []
                            });
                        }).catch((result) => {
                            // console.log("error is: "+ result)
                            res.status(200).json({
                                status: 'ok',
                                code: 200,
                                success: 'true',
                                response: result,
                                data: []
                                //    console.log('error occured')
                            });
                        });

                    }
                    // If username is found 
                    else {
                        // Checking password now
                        var sqlQuery = "SELECT role FROM users WHERE pin = crypt('" + req.body.pin + "', pin)";
                        db(sqlQuery, (error, results, fields) => {
                            // If password not found in db then fetching respective error detail and sending as JSON data
                            if (results.rows.length < 1) {
                                fn.getCustomErrResponse(402).then((result) => {
                                    res.status(200).json({
                                        status: 'ok',
                                        code: 200,
                                        success: 'true',
                                        response: result,
                                        data: []
                                    });
                                }).catch((result) => {
                                    // console.log("error is: "+ result)
                                    res.status(200).json({
                                        status: 'ok',
                                        code: 200,
                                        success: 'true',
                                        response: result,
                                        data: []
                                        //    console.log('error occured')
                                    });
                                });

                            }
                            // If password is found then assuming that user is not active
                            else {
                                fn.getCustomErrResponse(403).then((result) => {
                                    res.status(200).json({
                                        status: 'ok',
                                        code: 200,
                                        success: 'true',
                                        response: result,
                                        data: []
                                    });
                                }).catch((result) => {
                                    // console.log("error is: "+ result)
                                    res.status(200).json({
                                        status: 'ok',
                                        code: 200,
                                        success: 'true',
                                        response: result,
                                        data: []
                                        //    console.log('error occured')
                                    });
                                });

                            }
                        });
                    }
                });
            }

        }
        // if there is error in executing sql query on database
        else {
            res.status(200).json({
                status: 'ok',
                code: 400,
                success: 'false',
                response: error,
                data: []
            });

        }
        // console.log(rows[0]);
    });
});
module.exports = router;