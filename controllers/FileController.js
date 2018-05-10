var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    res.sendFile('F:/workspace/Node/chatapp2/node_modules/socket.io/lib/index.js')
})

module.exports = router