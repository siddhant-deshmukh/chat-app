var express = require('express');
const auth = require('../middleware/auth')
const user_controller = require('../controllers/userController')

var router = express.Router();
router.post('/addmessage',auth,  user_controller.register_user)

module.exports = router;