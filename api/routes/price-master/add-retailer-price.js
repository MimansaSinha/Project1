
const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');


router.post('/add', async (req, res) => {
    var resCode = 0;
    var result;
   
    try {

        //Getting data from user 
        const { state_id, city_id,product_id,barcode,sku_code, retailer_price,effective_from, effective_to, created_by, erp_code } = req.body;
        const enabled = true
        const created_on = new Date().toLocaleDateString();

        //var existingRow = `SELECT count (*) FROM tbl_distributor_price WHERE distributor_id in (${vendorIds})  AND product_id = (${product_id}) `;
        //console.log(existingRow)
        //console.log(existingRow.rowCount)
    
            //counting rows of same vendor_category with same product
            var existingRow = `SELECT * FROM tbl_retailer_price WHERE state_id=$1 AND city_id=$2 AND product_id=$3 `;
            var existingRowResult = await db.query(existingRow, [state_id, city_id, product_id]);

            if (existingRowResult.rowCount > 0) {

                //update the existing rows 
              const updateQuery = `UPDATE tbl_retailer_price SET effective_to=$1 WHERE state_id=$2 AND city_id=$3 AND product_id=$4 AND barcode=$5 AND sku_code=$6`;
              await db.query(updateQuery, [new Date().toLocaleDateString(), state_id, city_id,product_id, barcode, sku_code]);
              console.log("update query runs");

              //inserting new rows with different vendorIDS after updating ones
              var insertQuery = `INSERT INTO tbl_retailer_price ( state_id, city_id,product_id, barcode, sku_code, retailer_price, effective_from, effective_to, created_on, created_by, enabled, erp_code)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
              RETURNING *`;
             result = await db.query(insertQuery, [ state_id, city_id, product_id, barcode, sku_code, retailer_price, effective_from, effective_to, created_on, created_by, enabled, erp_code]);
             console.log("inner insert runs");
            }else{
                   //inserting new rows with different vendorIDS
                   var insertQuery = `INSERT INTO tbl_retailer_price ( state_id, city_id,product_id, barcode, sku_code, retailer_price, effective_from, effective_to, created_on, created_by, enabled, erp_code)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                   RETURNING *`;
                  result = await db.query(insertQuery, [ state_id, city_id, product_id, barcode, sku_code, retailer_price, effective_from, effective_to, created_on, created_by, enabled, erp_code]);
                  console.log("inner insert runs");
            }
        
          
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