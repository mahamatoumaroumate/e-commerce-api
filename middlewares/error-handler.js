const {StatusCodes}=require('http-status-codes')
const errorHandlerMiddleWare=(err,req,res,next)=>{
    let customError={
        statusCode:err.statusCode||StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message||'Something went wrong try again later'
    }
    if(customError.msg && customError.msg.startsWith("E11000")){
      customError.msg="This email is already registered , please try with new email"
      customError.statusCode=StatusCodes.BAD_REQUEST
    }
    if(customError.msg && customError.msg.startsWith('Cast')){
      customError.msg=`No item found with id : ${err.value}`,
      customError.statusCode=StatusCodes.BAD_REQUEST
    }
  res.status(customError.statusCode).json({msg:customError.msg})
}
module.exports=errorHandlerMiddleWare