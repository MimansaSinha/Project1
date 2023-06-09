const express = require('express');
const router = express.Router();
var db = require('../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
//var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../library/globals');

// API to updated 'enabled' field true or false
// Paramaeters used are 'tableName' (string), 'entityId' (string), 'action' (boolean) and 'fieldName' (string)
router.post('/', (req, res) => {
    var sqlQuery = "UPDATE " + req.body.tableName + " SET enabled = " +  req.body.action + " WHERE "  + req.body.fieldName + " = '" + req.body.entityId + "'";
    db(sqlQuery, (error, results, fields) => {   
        if (!error) {
             // console.log(results.rows);
                fn.getCustomErrResponse(200).then((result) => { 
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