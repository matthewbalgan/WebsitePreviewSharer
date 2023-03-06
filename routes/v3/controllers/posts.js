import express from 'express';
import session from 'express-session';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async (req, res) =>{
  if(req.session.isAuthenticated){
    try{
      const date = new Date()
      const newPost = new req.models.User({
        url: req.body.url,
        description: req.body.description,
        username: req.session.account.username,
        usage: req.body.usage,
        created_date: date
      })

      await newPost.save()

      res.json({"status": "success"})

    } catch(error) {
      console.log(error)
      res.status(500).json({"status": "error", "error": error})
    }
  } else {
    res.status(401).json({"status": "error", "error": "not logged in"})
  }
})

// likes the post
router.post('/like', async (req, res) =>{
  if(req.session.isAuthenticated){
    try{
      let postId = req.body.postID
      let post = await req.models.User.findById(postId)

      if(!post.likes.includes(req.session.account.username)){
        post.likes.push(req.session.account.username)
    }

      await post.save()

      res.json({"status": "success"})

    } catch(error) {
      console.log(error)
      res.status(500).json({"status": "error", "error": error})
    }
  } else {
    res.status(401).json({"status": "error", "error": "not logged in"})
  }
})

// unlikes the post
router.post('/unlike', async (req, res) =>{
  if(req.session.isAuthenticated){
    try{
      let postId = req.body.postID
      let post = await req.models.User.findById(postId)

      if(post.likes.includes(req.session.account.username)){
        post.likes.pull(req.session.account.username)
    }

      await post.save()

      res.json({"status": "success"})

    } catch(error) {
      console.log(error)
      res.status(500).json({"status": "error", "error": error})
    }
  } else {
    res.status(401).json({"status": "error", "error": "not logged in"})
  }
})

router.get('/', async (req, res, next) =>{
  try{
    if(req.query.username) {
      let allPosts = await req.models.User.find({ username: req.query.username})

      let postData = await Promise.all(
        allPosts.map(async post => {
            try{
                // TODO some await call
                let response = await getURLPreview(post.url)
                let desc = post.description
                let use = post.usage
                let uName = post.username
                let userId = post._id
                let likes = post.likes
                // TODO return info about post
                let result = {description: desc, htmlPreview: response, username: uName, usage: use, id: userId, likes: likes}

                return result
            }catch(error){
              console.log(error)
              res.status(500).json({"status": "error", "error": error})
            }
        })
      )
      res.json(postData)
    } else {
      let allPosts = await req.models.User.find()

      let postData = await Promise.all(
        allPosts.map(async post => {
            try{
                // TODO some await call
                let response = await getURLPreview(post.url)
                let desc = post.description
                let use = post.usage
                let uName = post.username
                let userId = post._id
                let likes = post.likes
                // TODO return info about post
                let result = {description: desc, htmlPreview: response, username: uName, usage: use, id: userId, likes: likes}
                return result
            }catch(error){
              console.log(error)
              res.status(500).json({"status": "error", "error": error})
            }
        })
      )
      res.json(postData)
    }

  } catch(error) {
    console.log(error)
    res.status(500).json({"status": "error", "error": error})
  }
})

router.delete("/", async (req, res) => {
  if(req.session.isAuthenticated){
    try{
      let postId = req.body.postID
      let post = await req.models.User.findById(postId)

      if(post.username == req.session.account.username) {

        let postId = req.body.postID

        //delete Comment for the post and the post
        await req.models.Comment.deleteMany({Comment: postId})
        await req.models.User.deleteOne({_id: postId})

        res.json({status:"success"})


      } else {
        res.status(401).json({"status": "error", "error": "you can only delete your own posts"})
      }

    } catch(error) {
      console.log(error)
      res.status(500).json({"status": "error", "error": error})
    }
  } else {
    res.status(401).json({"status": "error", "error": "not logged in"})
  }
})

export default router;