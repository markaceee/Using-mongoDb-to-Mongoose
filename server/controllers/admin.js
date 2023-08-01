const Product = require('../models/products')
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

exports.fetchAll = (req, res, next) => {
    Product.find()
        // .select('title price -_id') select custom rows
        // .populate('userId', 'name') its like joining two collections
        .then(products => {
            res.render("admin/products", {
                pageTitle: 'Products',
                path: '/admin/products',
                prods: products
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, price, imageUrl, description } = req.body
    let newProduct = new Product({
        title: title, 
        price: price, 
        imageUrl: imageUrl,
        description: description,
        userId: req.user
    })
    
    newProduct
        .save()
        .then(result => {
            console.log('Added new product')
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
    
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    const productID = req.params.id
    if (!editMode) {
        return res.redirect('/')
    }

    Product.findById(productID)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: "/admin/edit-product",
                editing: editMode,
                product: product
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postEditProduct = (req, res, next) => {
    const { title, price, imageUrl, description } = req.body
    const id = req.params.id

    Product.findById(id)
        .then(product => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save()
        })
        .then(result => {
            res.redirect("/admin/products")
        })
        .catch(err => console.log(err))
}

exports.getDeleteProduct = (req, res, next) => {
    let deleteProductById = req.params.id
    Product.findByIdAndRemove(deleteProductById)
        .then(result => {
            res.redirect("/admin/products")
        })
        .catch(err => console.log(err))
}