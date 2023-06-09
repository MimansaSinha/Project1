const express = require('express');
const router = express.Router();
var db = require('../../../../config/db.js');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../../library/globals.js');




router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = "SELECT a.influencer_id, a.order_id,b.redeemed_point , a.transaction_amount, a.date_of_transaction, a.barcode,a.invoice_number, a.date_of_upload,a.product_price,a.loyalty_point,a.created_by,c.influencer_name ,a.enabled, a.created_on, a.loyalty_point - b.redeemed_point AS balance FROM tbl_loyalty_point_accumulation a INNER JOIN tbl_loyalty_point_redemption b ON a.influencer_id = b.influencer_id INNER JOIN tbl_influencer c ON a.influencer_id = c.influencer_id";
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
  
}
        // console.log(result.rows[0].count);
    
    });


router.post('/add', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;

    try {
        // if(result){
            const now  =  new Date();
                    var createdOn = date.format(now,'YYYY/MM/DD HH:mm:ss');
                    var enabled = true
                    const { influencer_id ,order_id, transaction_amount, date_of_transaction, barcode, invoice_number,date_of_upload,product_price,loyalty_point,created_by, erp_code } = req.body
                    console.log(order_id)
                    sqlQuery = `INSERT INTO tbl_loyalty_point_accumulation(influencer_id ,order_id, transaction_amount, date_of_transaction, barcode, invoice_number, date_of_upload, product_price, loyalty_point,created_on, created_by, enabled, erp_code ) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10,$11, $12, $13)
                   RETURNING *`
                    result = await db.query(sqlQuery,[influencer_id,order_id, transaction_amount, date_of_transaction, barcode, invoice_number,date_of_upload,product_price,loyalty_point,createdOn ,created_by,enabled, erp_code])
                  return   res.json({
                    status: 'ok',
                    code: fn.apiSuccessResponseCode,
                    success: 'true',
                    response: null,
                    data: result.rows
                })
        

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