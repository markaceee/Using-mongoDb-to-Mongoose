const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin')

router.get('/add-product', admin.getAddProduct);
router.post('/add-product', admin.postAddProduct);

// router.get('/delete-product/:id', admin.getDeleteProduct)

// router.get('/edit-product/:id', admin.getEditProduct)
// router.post('/edit-product/:id', admin.postEditProduct)


// router.get('/products', admin.fetchAll)



module.exports = router;