const express = require('express');
const router = express.Router();

router.get('/avgbillofuser', require('../controllers/api').calcOrdersAndBill);
router.put('/updatenumoforders', require('../controllers/api').updateNumOfOrders);
//router.post('/postData', require('../controllers/api').postData);

module.exports = router;