const express = require('express');
const router = express.Router();
var db = require('../../../config/db.js');
var path = require('path');
var geoip = require('geoip-lite');
var dateTime = require('node-datetime');
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
        sqlQuery = "SELECT a.product_id, a.product_name,a.barcode,a.sku_code,a.hsn_code,b.product_group_name,c.product_category_name,c.product_category_id,a.enabled FROM tbl_product a INNER JOIN tbl_product_group b ON a.product_group_id=b.product_group_id INNER JOIN tbl_product_category c ON a.product_category_id=c.product_category_id ORDER BY a.product_id ASC";
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

    router.post('/add-photo', (req, res) => {
        console.log("api called");
        var path = __dirname + '/documents/temp' + '/' + req.body.filename;
        //    console.log (req.body.filename);
        var image = req.body.file;
        //    console.log (image);
        var data = image.split(',')[1];
        //    console.log (data);
        fs.writeFileSync(path, data, { encoding: 'base64' });
        res.json({ msg: 'success' });
    });

    router.post('/add', async (req, res) => {
        var sqlQuery;
        var resCode = 0;
        var result;
    
       
        try {
            var sqlquery = `SELECT COUNT(*) FROM tbl_product`
            var Result = await db.query(sqlquery);
            var RecCount = Result.rows[0].count
            var userId = parseInt(RecCount) + 1
    
            // moving user_photo to USERS folder
            if (fs.existsSync(__dirname + '/documents/temp' + '/' + req.body.product_photo)) {
                var src = __dirname + '/documents/temp' + '/' + req.body.product_photo
                var dest = __dirname + '/documents/PRA' + userId + '/' + req.body.product_photo
                fse.move(src, dest, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
                console.log('File exists');
            }
             
            var productPhotoUrl = 'user-management/documents/PRA' + userId + '/' + req.body.shop_logo

            const {product_group_id,product_group_name,product_category_id,product_category_name,barcode,qr_code,product_name,variant_id,sku_code, batch_number,
                 expiry_date,modal_number, brand_name, uom_id,hsn_code,available_for_sale,is_deal_item,is_for_individual_sale,has_linked_item, 
                 has_foc_item, created_by,erp_code} = req.body;
            const enabled = true
            const created_on = new Date().toLocaleDateString();
            sqlQuery = `INSERT INTO tbl_product (product_group_id, product_group_name, product_category_id, product_category_name, product_id, barcode, qr_code, product_name, variant_id, sku_code, batch_number, expiry_date, modal_number, brand_name, uom_id, hsn_code, available_for_sale, is_deal_item, is_for_individual_sale, has_linked_item, has_foc_item, product_image, created_on, created_by, enabled, erp_code)
            VALUES ($1, $2, $3, $4, CONCAT('PRD', (SELECT COUNT(*) FROM tbl_product) + 1), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
            RETURNING *`
            console.log("1st api called")
             result = await db.query( sqlQuery, [product_group_id,product_group_name,product_category_id,producnpt_category_name,barcode,qr_code,product_name,variant_id,sku_code, batch_number,
                expiry_date,modal_number, brand_name, uom_id,hsn_code,available_for_sale,is_deal_item,is_for_individual_sale,has_linked_item, 
                has_foc_item,productPhotoUrl,created_on,created_by,enabled, erp_code]);
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