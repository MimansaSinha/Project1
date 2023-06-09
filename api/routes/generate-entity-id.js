const express = require('express');
const router = express.Router();
var db = require('../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
//var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../library/globals');
router.post('/', (req, res) => {
            fn.generateEntityId(req.body.entity).then((result) => {
                console.log(result);
                    res.status(200).json({
                        status: 'ok',
                        code: 200,
                        success: 'true',
                        response: [],
                        data: [result]
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

        
    });
module.exports = router;