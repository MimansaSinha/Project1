
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
    var sqlQuery;
    var resCode = 0;
    var result;
   
    try {

        //Getting data from user 
        const { state_id, city_nid, vendor_type,  vendor_category ,product_id,barcode, discount_Type, discount_value ,effective_from, effective_to, created_by, erp_code } = req.body;
        const enabled = true
        const created_on = new Date().toLocaleDateString();
        var discount_type;
        if(discount_Type === 'Amount'){
            discount_type = 0
        }else{
            discount_type = 1
        }



        
        //var existingRow = `SELECT count (*) FROM tbl_distributor_price WHERE distributor_id in (${vendorIds})  AND product_id = (${product_id}) `;
        //console.log(existingRow)
        //console.log(existingRow.rowCount)


            //counting rows of same vendor_category with same product
            var existingRow = `SELECT * FROM tbl_periodic_discount WHERE state_id=$1 AND city_nid=$2 AND vendor_type=$3 AND vendor_category=$4 AND product_id=$5 `;
            var existingRowResult = await db.query(existingRow, [state_id,city_nid,vendor_type,vendor_category,product_id]);
            console.log('api runs')

            if (existingRowResult.rowCount > 0) {

                //update the existing rows 
              const updateQuery = `UPDATE tbl_periodic_discount SET effective_to=$1 WHERE state_id=$2 AND city_nid=$3 AND vendor_type=$4 AND vendor_category=$5 AND product_id=$6 AND barcode=$7`;
              await db.query(updateQuery, [new Date().toLocaleDateString(), state_id, city_nid, vendor_type, vendor_category, product_id, barcode]);
              console.log("update query runs");


              //inserting new rows with different vendorIDS after updating ones
              var insertQuery = `INSERT INTO tbl_periodic_discount ( state_id, city_nid, vendor_type, vendor_category, product_id, barcode, discount_type, discount_value, effective_from, effective_to, created_on, created_by, enabled, erp_code)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
              RETURNING *`;
             result = await db.query(insertQuery, [ state_id, city_nid, vendor_type, vendor_category, product_id, barcode, discount_type, discount_value, effective_from, effective_to, created_on, created_by, enabled, erp_code]);
             console.log("inner insert runs");
            }else{
                   //inserting new rows with different vendorIDS
                   var insertQuery = `INSERT INTO tbl_periodic_discount ( state_id, city_nid, vendor_type, vendor_category, product_id, barcode, discount_type, discount_value, effective_from, effective_to, created_on, created_by, enabled, erp_code)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                   RETURNING *`;
                  result = await db.query(insertQuery, [ state_id, city_nid, vendor_type, vendor_category, product_id, barcode, discount_type, discount_value, effective_from, effective_to, created_on, created_by, enabled, erp_code]);
                  console.log("outer insert runs");

        
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