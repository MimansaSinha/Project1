const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');

// API to get all records of zone table
router.get('/', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
        sqlQuery = "SELECT a.influencer_id, a.influencer_name, a.address,b.city_name,'yes' as approved, 'Kaushal.Kumar' as approved_by,a.enabled,a.state_id,a.country,a.pincode,a.landline_number,a.mobile_number,a.email,a.website,a.registration_number,a.gstin,a.aadhar_card_number,a.pan_card_number,a.driving_license_number,a.voter_card_number,a.passport_number,a.aadhar_card_photo,a.pan_card_photo,a.driving_license_photo,a.voter_card_photo,a.passport_photo,a.owner_kyc_photo,a.bank_account_number,a.bank_name,a.account_holder_name,a.ifsc_code,a.bank_address,a.shop_logo,a.shop_image,a.longitude,a.latitude,a.kyc_text_comment,a.kyc_audio_comment,a.kyc_verified,TO_CHAR(DATE(a.created_on),'dd-mm-yyyy') as created_on,a.created_by,a.modified_on,a.modified_by,a.erp_code,a.status,a.action_on,a.action_by,a.comment,d.state_name,e.area_name FROM tbl_influencer a INNER JOIN tbl_city b ON a.city_id=b.city_id INNER JOIN tbl_state d ON a.state_id=d.state_id INNER JOIN tbl_area e ON a.area_id=e.area_id ORDER BY a.influencer_id ASC";
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


router.put('/:influencer_id', async (req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;

    try {
        // if(result){
        const now = new Date();
        var action_on = date.format(now, 'YYYY/MM/DD HH:mm:ss');
        // var modified_by = 'piyush'
        var enabled = true
        const { status, action_by, comment } = req.body

        sqlQuery = " UPDATE tbl_influencer SET status=$1, action_on=$2, action_by=$3, comment=$4 WHERE influencer_id='" + req.params.influencer_id + "'"
        var result = await db.query(sqlQuery, [status, action_on, action_by, comment])
        return res.json({
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