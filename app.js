require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const adminRoutes = require('./server/routes/admin')
const shopRoutes = require('./server/routes/shop')
const error = require('./server/controllers/error');
const User = require('./server/models/user')


app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: false}))


app.use((req, res, next) => {
   User.findById('64c78375264e83b984af4a4a')
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err))
})


app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(error.errorPage)

mongoose.connect(process.env.MONGODB)
   .then(result => {
      User.findOne()
         .then(user => {
            if(!user){
               const user = new User({
                  name: "Mark",
                  email: 'test@gnail.com',
                  cart: {
                     items: []
                  }
               })
               user.save();
            }
         })

      app.listen(process.env.PORT, () => {
         console.log('Listening to port ' + process.env.PORT)
      })
   })
   .catch(err => {
      console.log(err)
   })




