import express from 'express';
import session from 'express-session';
var router = express.Router();


router.get('/', async function(req, res, next) {
  try{
    let postId = req.query.postID

    let postComments = await req.models.Comment.find({post: postId})

    res.json(postComments)
  }catch(error){
    console.log(error)
    res.status(500).json({"status": "error", "error": error})
  }
})

router.post('/', async (req, res) =>{
  if(req.session.isAuthenticated){
    try{
      const date = new Date()
      const newComment = new req.models.Comment({
        username: req.session.account.username,
        comment: req.body.newComment,
        post: req.body.postID,
        created_date: date
      })

      await newComment.save()

      res.json({"status": "success"})

    } catch(error) {
      console.log(error)
      res.status(500).json({"status": "error", "error": error})
    }
  } else {
    res.status(401).json({"status": "error", "error": "not logged in"})
  }
})

export default router;