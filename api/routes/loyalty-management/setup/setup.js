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
        sqlQuery = "SELECT a.minumum_points_required, a.loyalty_point_conversion, a.value_in_rupee, a.bank_payment_percent, a.purchase_percent, a.effective_from,a.enabled, a.effective_to FROM tbl_loyalty_point_declaration a";
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
                    const { minumum_points_required, loyalty_point_conversion, value_in_rupee, bank_payment_percent, purchase_percent, effective_from, effective_to,created_by, erp_code } = req.body
                    sqlQuery = `INSERT INTO tbl_loyalty_point_declaration(minumum_points_required , loyalty_point_conversion , value_in_rupee , bank_payment_percent , purchase_percent , effective_from , effective_to, created_by, enabled, erp_code ) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10)
                   RETURNING *`
                    result = await db.query(sqlQuery,[minumum_points_required, loyalty_point_conversion, value_in_rupee, bank_payment_percent, purchase_percent, effective_from, effective_to,created_by,enabled ,erp_code])
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