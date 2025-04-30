const CustomErrors=require('../errors')
const checkPermission=(requestUser,resourceUserId)=>{
    if(requestUser.role==='admin')return
    if(requestUser.userId===resourceUserId.toString())return
    throw new CustomErrors.NotAuthorize('Not Authorized to access this route')

}
module.exports=checkPermission