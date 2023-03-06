import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';

router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);

router.get('/api/v2', async function(req, res, next){

})

export default router;