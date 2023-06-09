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
        sqlQuery = "SELECT a.vendor_id,a.zone_id, a.vendor_type,a.erp_code, a.city_id, a.state_id, a.driving_license_number, a.voter_card_number,a.created_on, a.created_by, a.modified_on, a.modified_by, a.action_on, a.action_by, a.comment, a.status,a.kyc_text_comment,a.kyc_audio_comment, a.passport_number,b.state_name,c.city_name,a.vendor_category,a.vendor_name,a.owner_name,a.address,a.country,a.pincode,a.pan_card_number,a.landline_number,a.mobile_number,a.email,a.website,a.registration_number,a.gstin,a.aadhar_card_number,a.bank_account_number,a.bank_name,a.account_holder_name,a.ifsc_code,a.bank_address,a.latitude, a.longitude,d.area_id ,d.area_name,z.zone_name,'Yes' AS approved,a.enabled FROM tbl_vendor a INNER JOIN tbl_state b ON a.state_id=b.state_id  INNER JOIN tbl_zone z ON a.zone_id=z.zone_id  INNER JOIN tbl_area d ON a.area_id=d.area_id INNER JOIN tbl_city c ON a.city_id=c.city_id WHERE a.vendor_type='Distributor' ORDER BY a.vendor_id ASC";
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

    router.put("/:vendor_id", async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
      
        try {
          // if(result){
          const now = new Date();
          var modified_on = date.format(now, "YYYY/MM/DD HH:mm:ss");
          var action_on = date.format(now, "YYYY/MM/DD HH:mm:ss");
          console.log("runs");
          // var modified_by = 'piyush'
          var enabled = true;
          const {
            vendor_id,
            zone_id,
            state_id,
            city_id,
            area_id,
            vendor_category,
            vendor_name,
            owner_name,
            address,
            country,
            pincode,
            landline_number,
            mobile_number,
            bank_account_number,
            bank_name,
            account_holder_name,
            ifsc_code,
            bank_address,
            pan_card_number,
            aadhar_card_number,
            driving_license_number,
            voter_card_number,
            passport_number,
            kyc_text_comment,
            kyc_audio_comment,
            kyc_verified,
            action_by,
            comment,
            status,
            email,
            website,
            gstin,
            registration_number,
            latitude,
            longitude,
            modified_by,
            erp_code,
          } = req.body;
          //console.log(vendor_name);
          console.log(pincode);
          //console.log(address);
          //console.log(area_id);
          //console.log(country);
          //console.log(kyc_verified);
      
          sqlQuery =
            "UPDATE tbl_vendor SET vendor_id = $1, zone_id = $2, state_id = $3, city_id=$4, area_id = $5, vendor_category = $6, vendor_name = $7, owner_name=$8, address = $9, country = $10,pincode = $11, landline_number = $12, mobile_number = $13,  email = $14, website = $15, registration_number = $16, gstin = $17,aadhar_card_number=$18,pan_card_number=$19,driving_license_number=$20, voter_card_number=$21, passport_number=$22,bank_account_number=$23, bank_name=$24,account_holder_name=$25,ifsc_code=$26,bank_address=$27,kyc_text_comment=$28, kyc_audio_comment=$29,kyc_verified=$30, modified_on=$31,modified_by=$32, enabled=$33, erp_code = $34 WHERE vendor_id ='" +
            req.params.vendor_id +
            "'";
          var result = await db.query(sqlQuery, [
            vendor_id,
            zone_id,
            state_id,
            city_id,
            area_id,
            vendor_category,
            vendor_name,
            owner_name,
            address,
            country,
            pincode,
            landline_number,
            mobile_number,
            email,
            website,
            registration_number,
            gstin,
            aadhar_card_number,
            pan_card_number,
            driving_license_number,
            voter_card_number,
            passport_number,
            bank_account_number,
            bank_name,
            account_holder_name,
            ifsc_code,
            bank_address,
            kyc_text_comment,
            kyc_audio_comment,
            kyc_verified,
            modified_on,
            modified_by,
            enabled,
            erp_code,
          ]);
          console.log("success");
          return res.json({
            status: "ok",
            code: fn.apiSuccessResponseCode,
            success: "true",
            response: result.rows,
            data: result.rows,
          });
        } catch (err) {
          var errResponse = [];
          var eRes = {
            code: err.code,
            message: err.message,
          };
          errResponse.push(eRes);
          res.json({
            status: "ok",
            code: fn.apiErrorResponseCode,
            success: "false",
            response: errResponse,
            data: null,
          });
        }
      });


module.exports = router;