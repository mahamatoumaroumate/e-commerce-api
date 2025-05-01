const {StatusCodes}=require('http-status-codes')
const User=require('../models/User')
const CustomErrors=require('../errors')

const getAllUsers=async(req,res)=>{
    const users=await User.find({role:'user'}).select(['name','email','_id','role'])
    res.status(StatusCodes.OK).json({users,count:users.length})
}
const getSingleUser=async(req,res)=>{
    const user=await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new CustomErrors.NotFound(`No user found with id : ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser=async(req,res)=>{
    const user=await User.findOne({_id:req.user.userId}).select('-password')
    if(!user){
        throw new CustomErrors.NotFound(`No user found with id : ${req.user.userId}`)
    }
    res.status(StatusCodes.OK).json({user})
}
const updateUser=async(req,res)=>{
    const {name,email}=req.body
    if(!name || !email){
        throw new CustomErrors.BadRequest('please provide all the fields values')
    }
    const user=await User.findOne({_id:req.user.userId})
    console.log(user);
    user.name=name
    user.email=email
   await user.save()
    res.status(StatusCodes.OK).json({msg:'updated user successfully',user})
}

const updateUserPassword=async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findOne({_id:req.user.userId})
    if(!user){
        throw new CustomErrors.NotFound(`No user found with id : ${req.user.userId}`)
    }
    const isPasswordCorrect=await user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new CustomErrors.NotFound(`Sorry the password did not matched`)
    }
     user.password=newPassword
     await user.save()
    res.send('password updated successfully')
}
const deleteUser=async(req,res)=>{
    const user=await User.findOneAndDelete({_id:req.params.id})
    res.status(StatusCodes.OK).json({msg:"successfully deleted user"})
}

module.exports={getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword,deleteUser}

// other alternative for updateUser

// const updateUser=async(req,res)=>{
//     const {name,email}=req.body
//     if(!name || !email){
//         throw new CustomErrors.BadRequest('please provide all the fields values')
//     }
//     const user=await User.findOneAndUpdate({_id:req.user.userId},{name,email},{new:true,runValidators:true}).select('-password')
//     res.status(StatusCodes.OK).json({msg:'updated user successfully',user})
// }