const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');



/**
 * Customer routes
 */
router.get('/', customerController.homepage);
router.get('/about', customerController.about);
router.get('/add', customerController.addCustomer);
router.post('/add', customerController.postCustomer);

router.get('/view/:id', customerController.view);
router.get('/view/:id', customerController.viewPost);
router.get('/edit/:id', customerController.edit);

router.put('/edit/:id', customerController.editPost);
router.delete('/edit/:id', customerController.deleteCustomer);
router.post('/search', customerController.searchCustomer);






module.exports = router;