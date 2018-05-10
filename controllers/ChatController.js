var Auth = require('./AuthController')

var users = []

var Models = require('../models/index')
var User = Models.User
var Chat = Models.Chat

module.exports.register = (token, socketId) => {
    var p = new Promise ((resolve, reject) => {
        Auth.tokenCheckerChat(token)
        .then((res) => {
            User.findById(res.id)
                .then((user) => {
                    for(i=0; i<users.length; i++){
                        if(users[i].socketId == socketId){
                            return resolve({msg: 'socket exists', id: res.id})
                        }
                    } 
                    users.push({id: user.id, socketId: socketId})
                    console.log(users)
                    return resolve({id: res.id})                  
                }).catch((err) => {
                   console.log(err)                   
                   return reject()
                })            
        }).catch((err) => {            
            return reject({err: 'Auth Failed'})
        })  
    })
    return p  
}

module.exports.findSocketId = (id) => {
    for(i=0; i<users.length; i++){
        if(users[i].id == id){
            return users[i].socketId
        }
    }
}

module.exports.unsubscribe = (socketId) => {
    for(i=0; i<users.length; i++){
        if(users[i].socketId == socketId){
            users.splice(i, 1)
        }
    }
}

module.exports.saveChat = (data) => {
    new Chat({
        msg: data.msg,
        from: data.from,
        to: data.to,
        date: data.date
    }).save()  
      .then((res) => {
          console.log('saved' + res)
      }).catch((err) => {
            console.log(err)
      }) 
}