const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
// var dateTime = require('node-datetime');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');
const { json } = require('body-parser');



    router.get('/', async(req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
        try {
            sqlQuery = "SELECT a.product_id,a.product_name,b.distributor_price,c.cgst,c.sgst, (c.cgst + c.sgst) as tax,e.discounttype,e.discountvalue,a.enabled FROM tbl_product a INNER JOIN tbl_distributor_price b ON a.product_id = b.product_id INNER JOIN tblhsncode c ON a.hsn_code = c.hsncode INNER JOIN tbl_periodic_discount d ON a.product_id = d.product_id INNER JOIN tbldiscountsetup e ON d.discountcode = e.discountcode WHERE b.distributor_id = 'VND1'";
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



module.exports = router;