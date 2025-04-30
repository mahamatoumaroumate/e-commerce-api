const express=require('express')
const router=express.Router()
const {createOrder,getAllOrders,getCurrentUserOrders,getSingleOrder,updateOrder}=require('../controllers/orderController')
const {authenticateUser,checkPermissions}=require('../middlewares/authentication')

router.get('/',authenticateUser,checkPermissions('admin'),getAllOrders)
router.post('/',authenticateUser,createOrder)
router.patch('/:id',authenticateUser,updateOrder)
router.get('/showAllMyOrders',authenticateUser,getCurrentUserOrders)
router.get('/:id',authenticateUser,getSingleOrder)
module.exports=router