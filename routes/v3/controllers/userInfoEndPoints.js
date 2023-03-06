import express from 'express';
import session from 'express-session';
var router = express.Router();


router.get('/', async function(req, res, next) {
  try{
    let specUser = req.query.user

    let usersUserInfo = await req.models.UserInfo.find({username: specUser})

    res.json(usersUserInfo)
  }catch(error){
    console.log(error)
    res.status(500).json({"status": "error", "error": error})
  }
})



router.post('/', async (req, res) =>{
  if(req.session.isAuthenticated){
    try{
      const newUserInfo = new req.models.UserInfo({
        username: req.session.account.username,
        note: req.body.note
      })

      await newUserInfo.save()

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