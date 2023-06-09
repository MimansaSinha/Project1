
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
    var result;
   
    try {

        //Getting data from user 
        const { parent_product_id, foc_item_id, parent_item_qty, foc_item_qty, unit_price, effective_from, effective_to, created_by, erp_code } = req.body;
        const enabled = true
        const created_on = new Date().toLocaleDateString();


            //counting rows of same vendor_category with same product
            var existingRow = `SELECT * FROM tbl_foc WHERE parent_product_id=$1 AND foc_item_id=$2 AND parent_item_qty=$3 AND foc_item_qty=$4 `;
            var existingRowResult = await db.query(existingRow, [parent_product_id, foc_item_id, parent_item_qty, foc_item_qty]);
            console.log('api runs')

            if (existingRowResult.rowCount > 0) {

                //update the existing rows 
              const updateQuery = `UPDATE tbl_foc SET effective_to=$1 WHERE parent_product_id=$2 AND foc_item_id=$3 AND parent_item_qty=$4 AND foc_item_qty=$5`;
              await db.query(updateQuery, [new Date().toLocaleDateString(), parent_product_id, foc_item_id, parent_item_qty, foc_item_qty]);
              console.log("update query runs");


              //inserting new rows with different vendorIDS after updating ones
              var insertQuery = `INSERT INTO tbl_foc ( parent_product_id, foc_item_id, parent_item_qty, foc_item_qty, unit_price, effective_from, effective_to, created_on, created_by, enabled, erp_code)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
              RETURNING *`;
             result = await db.query(insertQuery, [ parent_product_id, foc_item_id, parent_item_qty, foc_item_qty,unit_price ,effective_from, effective_to, created_on, created_by, enabled, erp_code]);
             console.log("inner insert runs");
            }else{
                   //inserting new rows with different vendorIDS
                   var insertQuery = `INSERT INTO tbl_foc ( parent_product_id, foc_item_id, parent_item_qty, foc_item_qty, unit_price, effective_from, effective_to, created_on, created_by, enabled, erp_code)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                   RETURNING *`;
                  result = await db.query(insertQuery, [ parent_product_id, foc_item_id, parent_item_qty, foc_item_qty,unit_price ,effective_from, effective_to, created_on, created_by, enabled, erp_code]);
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