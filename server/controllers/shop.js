const adminData = require('../routes/admin')
// const Cart = require('../models/cart')
const Product = require('../models/products')
const User = require('../models/user')
const Order = require('../models/orders')

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/index", {
                pageTitle: 'Home', 
                path: '/', 
                prods: products
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'Product list', 
                path: '/products', 
                prods: products
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProductDetails = (req, res, next) => {
    const productID = req.params.id
    Product.findById(productID)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: 'Details', 
                path: '/products', 
                product: product
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            res.render('shop/cart', {
                pageTitle: 'Cart', 
                path: '/cart', 
                products: products
            });
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID

    Product.findById(productID)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postDeleteCartProduct = (req, res, next) => {
    const productId = req.body.productId
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: {...i.productId._doc}
                }
            })
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            })

            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getOrders = (req, res, next) => {

    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders', 
                path: '/orders', 
                orders: orders
            });
        })
        .catch(err => {
            console.log(err)
        });




}
















