const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    userActive = true
    res.render('user/home', {data: req.session.user})
})

router.get('/profile', (req,res)=>{
    userActive = true
    res.render('user/profile', {data: req.session.user})
})

module.exports = router