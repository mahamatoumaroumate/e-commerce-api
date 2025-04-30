const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide the name'],
        minlength:[3,'the name can not be less then 3 characters.'],
        maxlength:[50,'the name must be less then 50 characters.']
    },
    email:{
        type:String,
        required:[true,'please provide the email'],
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:"please provide valid email"
        }
    },
    password:{
        type:String,
        required:[true,'please provide the password'],
        minlength:6},
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
})
UserSchema.pre('save',async function(){
    if(!this.isModified('password'))return 
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
UserSchema.methods.comparePassword=async function(candidatePassword){
  return await bcrypt.compare(candidatePassword,this.password)
}
module.exports=mongoose.model('User',UserSchema)