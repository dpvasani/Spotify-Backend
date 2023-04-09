const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const  getSongThumbnail  = require('../controllers/getSongThumbnail');

router.get('/', songController.getAllSongs);
router.post('/', songController.refreshAllSongs);
// router.get('/thumbnails', getSongThumbnail.getSongThumbnails)
router.get('/search',songController.searchSongs);
router.get('/:id', songController.getSong);

module.exports = router;
