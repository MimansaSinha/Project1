const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', (req, res) => {
    var sqlQuery = "SELECT entity_id, zone_name, created_on, created_by,  enabled FROM zone";
    db(sqlQuery, (error, results, fields) => {
        if (!error) {
            // if record is found
            if (results.rows.length > 0) {
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
            // If zone name does not exist
            else {
                fn.getCustomErrResponse(404).then((result) => {
                    res.status(200).json({
                        status: 'ok',
                        code: 200,
                        success: 'true',
                        response: result,
                        data: []
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


// API to insert zone in zone table
// Paramaeters used are 'zone' (string), 'erp_id' (string), 'description' (string) and 'username' (string)
router.post('/add', (req, res) => {
    var sqlQuery = "SELECT zone FROM zone WHERE zone ='" + req.body.zone + "'";
    db(sqlQuery, (error, results, fields) => {
        if (!error) {
            // if zone name already exists
            if (results.rows.length > 0) {
                // Display message for duplicate record
                fn.getCustomErrResponse(409).then((result) => {
                    res.status(200).json({
                        status: 'ok',
                        code: 200,
                        success: 'true',
                        response: result,
                        data: []
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
            // If zone name does not exist
            else {
                // Setting current date time 
                var dt = dateTime.create();
                var createdOn = dt.format('d-m-Y H:M:S');
              //Calling function to generate next zone_id
                fn.generateEntityId('zone').then((result) => {
                    var sqlQuery = "INSERT INTO zone (zone_id, zone, erp_id, description, created_on, created_by, enabled) VALUES ('" + result.entity_id + "', '" + req.body.zone + "', '" + req.body.erp_id + "','" + req.body.description + "', '" + createdOn + "', '" + req.body.username + "','true')";
                    // console.log(sqlQuery);
                    db(sqlQuery, (error, results, fields) => {
                        if (!error) {
                            // Calling function to updating current number and current entity id in sequence_number table
                            fn.updateSequenceTable(result).then((result) => {
                                fn.getCustomErrResponse(201).then((result) => {
                                    res.status(200).json({
                                        status: 'ok',
                                        code: 200,
                                        success: 'true',
                                        response: result,
                                        data: []
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

                            // catch for updateSequenceTable() function
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
                        // if there is error in executing insert sql query on database
                        else {
                            console.log(error);
                            res.status(200).json({
                                status: 'ok',
                                code: 400,
                                success: 'false',
                                response: error,
                                data: []
                            });
                        }
                    });
                // catch for generateEntityId() function
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
            }
            // if there is error in executing select sql query on database
            else {
                console.log(error);
                            res.status(200).json({
                                status: 'ok',
                                code: 400,
                                success: 'false',
                                response: error,
                                data: []
                            });
            }
                    });
   

        });

module.exports = router;