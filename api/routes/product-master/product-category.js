const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = "SELECT a.product_category_id, a.product_category_name,b.product_group_name,'ERP746' as erp_code,a.enabled FROM tbl_product_category a INNER JOIN tbl_product_group b ON a.product_group_id=b.product_group_id ORDER BY a.product_category_id ASC";
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
            const {product_group_id,product_category_name,created_by,erp_code} = req.body;
            const enabled = true
            const created_on = new Date().toLocaleDateString();
            sqlQuery = `INSERT INTO tbl_product_category (product_category_id,product_group_id,product_category_name,created_on,created_by,enabled, erp_code )
            VALUES (CONCAT('PRC', (SELECT COUNT(*) FROM tbl_product_category) + 1), $1, $2, $3, $4, $5,$6)
            RETURNING *`
            console.log("1st api called")
             result = await db.query( sqlQuery, [product_group_id,product_category_name,created_on,created_by,enabled, erp_code,]);
             res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'true',
                response: null,
                data: result.rows
            });
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