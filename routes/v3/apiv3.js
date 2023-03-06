import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';
import usersRouter from './controllers/users.js';
import commentsRouter from './controllers/comments.js';
import userInfosRouter from './controllers/userInfoEndPoints.js';

router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);
router.use('/userInfoEndPoints', userInfosRouter);

router.get('/api/v3', async function(req, res, next){

})

export default router;