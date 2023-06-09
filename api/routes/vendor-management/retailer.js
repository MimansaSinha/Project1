const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
const date = require('date-and-time');
// Adding custom library to access custom global variables
var fn = require('../../../library/globals');
const fs = require('fs')
const fse = require('fs-extra');

// API to get all records of zone table
router.get('/', async(req, res) => {
    var sqlQuery;
    var resCode = 0;
    var result;
    try {
       sqlQuery = "SELECT a.vendor_id,a.zone_id, a.vendor_type,a.erp_code, a.city_id, a.state_id, a.driving_license_number, a.voter_card_number,a.created_on, a.created_by, a.modified_on, a.modified_by, a.action_on, a.action_by, a.comment, a.status,a.kyc_text_comment,a.kyc_audio_comment, a.passport_number,b.state_name,c.city_name,a.vendor_category,a.vendor_name,a.owner_name,a.address,a.country,a.pincode,a.pan_card_number,a.landline_number,a.mobile_number,a.email,a.website,a.registration_number,a.gstin,a.aadhar_card_number,a.bank_account_number,a.bank_name,a.account_holder_name,a.ifsc_code,a.bank_address,a.latitude, a.longitude,d.area_id ,d.area_name,z.zone_name,'Yes' AS approved,a.enabled FROM tbl_vendor a INNER JOIN tbl_state b ON a.state_id=b.state_id  INNER JOIN tbl_zone z ON a.zone_id=z.zone_id  INNER JOIN tbl_area d ON a.area_id=d.area_id INNER JOIN tbl_city c ON a.city_id=c.city_id WHERE a.vendor_type='Retailer' ORDER BY a.vendor_id ASC";
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

    router.post('/upload', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
        console.log(path.basename(path.resolve(process.cwd())))
    
        console.log("Current directory:", process.cwd());
        try {
            var sqlquery = `SELECT COUNT(*) FROM tbl_vendor`
            var Result = await db.query(sqlquery);
            var RecCount = Result.rows[0].count
            var vendorId = parseInt(RecCount) + 1
    
            // moving shop_logo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.shop_logo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.shop_logo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.shop_logo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
            //  moving shop_image to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.shop_image)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.shop_image
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.shop_image
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
            //  moving aadhar_card_photo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.aadhar_card_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.aadhar_card_photo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.aadhar_card_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
            // moving pan_card_photo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.pan_card_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.pan_card_photo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.pan_card_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
    
            // moving driving_license_photo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.driving_license_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.driving_license_photo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.driving_license_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
            // moving voter_card_photo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.voter_card_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.voter_card_photo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.voter_card_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
            // moving passport_photo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.passport_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.passport_photo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.passport_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
            // moving owner_kyc_photo to VNDID folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.owner_kyc_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.owner_kyc_photo
                var dest = __dirname + '/documents/VND' + vendorId + '/' + req.body.owner_kyc_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
    
    
    
            var shopLogoUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.shop_logo
            var shopImageUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.shop_image
            var aadharUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.aadhar_card_photo
            var panUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.pan_card_photo
            var drivingUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.driving_license_photo
            var voterIdUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.voter_card_photo
            var passportUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.passport_photo
            var ownerKycUrl = 'vendor-management/documents/VND' + vendorId + '/' + req.body.owner_kyc_photo
            console.log()
            const now = new Date();
            var createdOn = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            var enabled = true;
            var kyc_verified = true;
            console.log('documents/VND' + vendorId + '/' + req.body.shop_logo)
            const { zone_id, state_id, city_id, area_id, vendor_type, vendor_category, vendor_name, owner_name, address, country, pincode, landline_number, mobile_number, email, website, registration_number, gstin, bank_account_number
                , bank_name, account_holder_name, ifsc_code,bank_address, aadhar_card_number, pan_card_number, driving_license_number, voter_card_number, passport_number, kyc_text_comment
                , created_by, longitude, latitude, erp_code } = req.body
            sqlQuery = `INSERT INTO tbl_vendor(vendor_id,
                            zone_id,state_id,city_id,area_id,vendor_type,vendor_category,vendor_name,owner_name,address,country,pincode,landline_number,mobile_number,email,website,registration_number,gstin,bank_account_number
                            ,bank_name,account_holder_name,ifsc_code,bank_address,aadhar_card_number,pan_card_number,driving_license_number,voter_card_number,passport_number,kyc_text_comment,
                            kyc_verified,created_on,created_by,longitude,latitude,erp_code,enabled,aadhar_card_photo,pan_card_photo,driving_license_photo,voter_card_photo,passport_photo,owner_kyc_photo,shop_logo,shop_image
                            ) VALUES(CONCAT('VND',${vendorId}), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43)RETURNING *`
            result = await db.query(sqlQuery, [zone_id, state_id, city_id, area_id, vendor_type, vendor_category, vendor_name, owner_name, address, country, pincode, landline_number, mobile_number, email, website, registration_number, gstin, bank_account_number
                , bank_name, account_holder_name, ifsc_code, bank_address,aadhar_card_number, pan_card_number, driving_license_number, voter_card_number, passport_number, kyc_text_comment, kyc_verified, createdOn, created_by, longitude, latitude, erp_code, enabled, aadharUrl, panUrl, drivingUrl, voterIdUrl, passportUrl, ownerKycUrl, shopLogoUrl, shopImageUrl])
    
            
            res.json({
                status: 'ok',
                code: fn.apiSuccessResponseCode,
                success: 'true',
                response: null,
                data: result.rows
            })
    
        }
        catch (err) {
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
            console.log(eRes)
        }
    
        // }
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