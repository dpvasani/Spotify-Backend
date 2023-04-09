const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
// const verifyToken = require('');

router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getPlaylists);
router.get('/:id', playlistController.getPlaylist);
router.put('/:id', playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);
router.post('/:id/songs', playlistController.addSongToPlaylist);
router.delete('/:id/songs', playlistController.removeSongFromPlaylist);

module.exports = router;
