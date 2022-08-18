var express = require('express');
const auth = require('../middleware/auth')
const user_controller = require('../controllers/userController')

const app = express();
var router = express.Router();
const groupRouter = require('./group')
const personalRouter=require('./personal')

/* GET users listing. */
router.get('/',auth, function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register',  user_controller.register_user)
router.post('/login', user_controller.login_user)

//app.use('/group',groupRouter)
//app.use('/personal',personalRouter)
router.post('/personal/addmessage', auth, user_controller.send_message)
//router.post('/', user_controller.login_user)

module.exports = router;