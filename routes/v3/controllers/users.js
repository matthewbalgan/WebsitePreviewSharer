import express from 'express';
import session from 'express-session';
var router = express.Router();

/* GET users listing. */
router.get('/myIdentity', async function(req, res, next) {
  if(req.session.isAuthenticated){
    res.send({
      status: "loggedin",
      userInfo: {
         name: req.session.account.name,
         username: req.session.account.username}
   })
  } else {
    res.json({ status: "loggedout" });
  }

});




export default router;