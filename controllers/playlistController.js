const jwt = require("jsonwebtoken");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

exports.createPlaylist = (req, res) => {
  const { name, description } = req.body;
  // Create a new playlist
  const newPlaylist = new Playlist({
    user_id: req.user._id,
    name: name,
    description: description,
  });
  newPlaylist.save((err) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(201).json({ message: "Playlist created successfully" });
  });
};

exports.getPlaylists = (req, res) => {
  Playlist.find({ user_id: req.user._id }, (err, playlists) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.json(playlists);
  });
};

exports.getPlaylist = (req, res) => {
  Playlist.findOne(
    { _id: req.params.id, user_id: req.user._id },
    (err, playlist) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!playlist)
        return res.status(404).json({ message: "Playlist not found" });
      return res.json(playlist);
    }
  );
};

exports.updatePlaylist = (req, res) => {
  const { name, description } = req.body;
  if (!name && !description)
    return res.status(400).json({ message: "Name or description required" });

  // Update the playlist with the specified ID
  Playlist.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    { name, description },
    { new: true },
    (err, playlist) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!playlist)
        return res.status(404).json({ message: "Playlist not found" });
      return res.json({ message: "Playlist updated successfully" });
    }
  );
};

exports.deletePlaylist = (req, res) => {
  // Delete the playlist with the specified ID
  Playlist.findOneAndDelete(
    { _id: req.params.id, user_id: req.user._id },
    (err, playlist) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!playlist)
        return res.status(404).json({ message: "Playlist not found" });
      return res.json({ message: "Playlist deleted successfully" });
    }
  );
};

exports.addSongToPlaylist = (req, res) => {
  // Find the song by its id
  Song.findById(req.body.song_id, (err, song) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!song) return res.status(404).json({ message: "Song not found" });

    // Get the playlist with the specified ID and add the song to it
    Playlist.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { $push: { songs: song } },
      { new: true, useFindAndModify: false },
      (err, playlist) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!playlist)
          return res.status(404).json({ message: "Playlist not found" });
        return res.json({ message: "Song added to playlist successfully" });
      }
    );
  });
};

exports.removeSongFromPlaylist = (req, res) => {
  // Get the playlist with the specified ID and remove the song from it
  Playlist.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    { $pull: { songs: req.body.song_id } },
    { new: true },
    (err, playlist) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!playlist)
        return res.status(404).json({ message: "Playlist not found" });
      return res.json({ message: "Song removed from playlist successfully" });
    }
  );
};
