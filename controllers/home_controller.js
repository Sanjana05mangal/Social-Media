const Post = require('../models/post');
// const Posts= require('../models/post');
const User = require('../models/user');

module.exports.home= async function(req,res){
    // console.log(req.cookies);

    //  Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    //  });
   // populate the user of each post
    try{
        let posts=  await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate :{
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).populate('comments')
            .populate('likes');
    
        let users=  await User.find({});
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
     }
    catch(err){
    console.log('Error', err);
    return;
    }
    
        
     
    
}
// module.exports.actionName= function(red,res){}