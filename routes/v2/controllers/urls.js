import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
//router.use('/preview', getURLPreview)

router.get('/preview', async function(req, res, next){
  res.send(await getURLPreview(req.url))
})

export default router;