const axios = require("axios");
const Song = require("../models/Song");
const { v4: uuidv4 } = require("uuid");



exports.refreshAllSongs = async (req, res) => {
  try {
    console.log("Refreshing songs...");
    const response = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${process.env.LAST_FM}&format=json&limit=1000&page=4`
    );
    const songs = response.data.tracks.track;
    // console.log(songs);

    const songPromises = songs.map(async (song) => {
      const existingSong = await Song.findOne({ preview_url: song.url });
      if (!existingSong) {
        // Save song
        if (!song.mbid) {
          song.mbid = uuidv4();
        }

        const newSong = new Song({
          song_id: song.mbid,
          name: song.name,
          artist: song.artist?.name,
          album: song.album?.name,
          duration: song?.duration,
          preview_url: song?.url,
        });
        await newSong.save();
      }
    });
    await Promise.all(songPromises);

    // Retrieve all songs from the database
    const dbSongs = await Song.find({});

    return res.json({
      message: "songs retrieved successfully",
      songs: dbSongs,
    });
  } catch (error) {
    if (!res.headersSent)
      return res.status(500).json({ message: error.message });
    else{throw new Error("Error")}
  }
};

exports.getAllSongs = async (req, res) => {
  try {
    // Get the page number and the number of items per page from the query parameters
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    if (pageNumber < 1 || itemsPerPage < 1)
      return res.status(400).json({ message: "Invalid page number or items per page" });

    //if itemsPerPage is greater than 1000, set it to 1000
    if (itemsPerPage > 1000) itemsPerPage = 1000;

    

    // Retrieve all songs from the database
    const totalItems = await Song.countDocuments();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const dbSongs = await Song.find({}).skip((pageNumber - 1) * itemsPerPage).limit(itemsPerPage);

    return res.json({
      message: "songs retrieved successfully",
      songs: dbSongs,
      totalPages: totalPages,
      totalItems: totalItems
    });
  } catch (error) {
    if (!res.headersSent)
      return res.status(500).json({ message: error.message });
    else{throw new Error("Error")}
  }
};


exports.getSong = (req, res) => {
  // Get the song with the specified ID from the MongoDB
  Song.findById(req.params.id, (err, song) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!song) return res.status(404).json({ message: "Song not found" });
    else{return res.json(song)}
  });
};

exports.searchSongs = (req, res) => {
  // Search for songs by query from MongoDB
  Song.find({ $text: { $search: req.query.q } }, (err, songs) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!songs) return res.status(404).json({ message: "No songs found" });
    else{return res.json(songs)}
  });
};


