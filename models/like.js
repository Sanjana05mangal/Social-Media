 const mongoose = require('mongoose');
 const LikeSchema= new mongoose.Schema({
     user : {
        type: mongoose.Schema.ObjectId
     },
     // this defines the object id of liked object
     likeable:{
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
     },
     // this defines the type of liked object since it is for dynamic reference
     onModel:{
         type: String,
         required:true,
         enum: ['Post', 'Comment']
     }
     },{
         timestamps:true
     
 });
 const Like= mongoose.model('Like', LikeSchema);
 module.exports = Like;
