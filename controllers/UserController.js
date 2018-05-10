var express = require("express")
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var models = require('../models/index')

var Auth = require('./AuthController')

var User = models.User
var Chat = models.Chat

router.get('/', (req, res)=>{
    User.find()
        .then((users) => {
           res.status(200).json( users) 
        }).catch((err) =>{
            res.status(500).json({err: 'error'})
        })    
})

router.post('/', Auth.tokenChecker, (req, res)=>{
    User.find()
        .then((users) => {
            users.map(user => user.password = undefined)
           res.status(200).json( users) 
        }).catch((err) =>{
            res.status(500).json({err: 'error'})
        })    
})

router.post('/getUser', Auth.tokenChecker, (req, res)=>{
    User.findById(req.user.id)
        .then((user) => {
            user.password = 'undefined'
           res.status(200).json( user) 
        }).catch((err) =>{
            res.status(500).json({err: 'error'})
        })    
})


router.post('/signup', (req, res) => {
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){return res.status(500).json({error: err})}
        else{
            new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            }).save()
            .then((result)=>{
                res.status(201).json(result)
            }).catch((err) => {
                res.status(409).json({err: 'duplicate document'})
            })
        }
    })
})

router.post('/signin', (req, res) => {
    console.log(req.body)
    User.find({email: req.body.email}).then((user) => {
        if(user.length < 1){
            return res.status(403).json({msg: 'invalid credentials'})
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if(result){
            let token = jwt.sign({id: user[0].id}, 'JWT_SECRET', {expiresIn: '10h'})
            return res.status(200).json({msg: 'Auth successful', token: token})  
          }
          return res.status(403).json({msg: 'invalid credentials'})
        })        
    }).catch((err) =>
    {
        res.status(500).json({err: 'error'})
        console.log(err)
    })
})

router.delete('/', (req, res) => {
    User.findByIdAndRemove(req.body.id, (err, user) => {
        if(err){
            res.status(200).send(err)
        }else{
            res.status(500).json(user)
        }
    }).catch((err) => {
        res.status(500).json({error: err})
    })
})

router.post('/protected', Auth.tokenChecker, (req, res, next) => {
    User.findById(req.user.id)
    .then((user) => {
        user.password = undefined
        res.status(200).json({user: user})
    }).catch((err) => {
        res.status(500).json({error: err})
    })
    
})

router.get('/cron', (req, res) => {
    res.json({msg: 'cron route'})
    setInterval(() => {
        console.log('setInterval')
    }, 2000)
})

router.post('/chats', Auth.tokenChecker, (req, res) => {
    Chat.find({
        $or: [  
            {$and:  [{from: req.user.id}, {to: req.body.to}]},
            {$and:  [{from: req.body.to}, {to: req.user.id}]}
            ]
        }).then((chats)=>{
            res.status(200).json(chats)
        }).catch((err)=>{
            res.status(500).json(err)
        })
})

module.exports = router;