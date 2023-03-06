import express from 'express';
var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async (req, res) =>{
  try{
    const date = new Date()
    const newPost = new req.models.User({
      url: req.body.url,
      description: req.body.description,
      usage : req.body.usage,
      created_date: date
    })

    await newPost.save()

    res.json({"status": "success"})

  } catch(error) {
    console.log(error)
    res.status(500).json({"status": "error", "error": error})
  }
})

router.get('/', async (req, res, next) =>{
  try{
    let allPosts = await req.models.User.find()
    console.log(allPosts)
    console.log(typeof(allPosts))

    let postData = await Promise.all(
      allPosts.map(async post => {
          try{
              // TODO some await call
              let response = await getURLPreview(post.url)
              let desc = post.description
              let use = post.usage
              // TODO return info about post
              let result = {description: desc, htmlPreview: response, usage: use}

              return result
          }catch(error){
            console.log(error)
            res.status(500).json({"status": "error", "error": error})
          }
      })
  )
    res.json(postData)

  } catch(error) {
    console.log(error)
    res.status(500).json({"status": "error", "error": error})
  }
})

export default router;