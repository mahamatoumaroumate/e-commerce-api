const mongoose=require('mongoose')
const ReviewSchema=mongoose.Schema({
    rating:{
        type:Number,
        default:1,
        min:1,
        max:5,
    },
    title:{
        type:String,
        maxlength:100,
        required:[true,'please provide the title for description'],
    },
    comment:{
        type:String,
        required:[true,'please provide the comment for review'],
        minlength:[20,'the comment must be greater or equal to 20 characters'],
        maxlength:[250,'the comment must be greater or equal to 20 characters']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true,
    }
},{timestamps:true})

ReviewSchema.index({product:1,user:1},{unique:true})
ReviewSchema.statics.calculateAverageRating=async function(productId){
    const result=await this.aggregate([
        {$match:{product:productId}},
        {
            $group:{
                _id:null,
                averageRating:{$avg:'$rating'},
                numOfReviews:{$sum:1}
            }
        }
    ])
    try {
        await this.model('Product').findOneAndUpdate(
            {_id:productId},{averageRating:Math.ceil(result[0]?.averageRating||0),
               numOfReviews:result[0]?.numOfReviews ||0
            }
        )
    } catch (error) {
        console.log(error);
        
    }
}

ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product)
})
ReviewSchema.post('deleteOne',{document:true,query:false},async function(){
    await this.constructor.calculateAverageRating(this.product)
})
module.exports=mongoose.model('Review',ReviewSchema)