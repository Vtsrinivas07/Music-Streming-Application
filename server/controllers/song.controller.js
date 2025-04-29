const Song = require('../models/song.model');
const User = require('../models/user.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all songs
// @route  GET /api/songs
// @access Public
exports.getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
      .populate('artist', 'name image')
      .populate('album', 'title coverImage');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single song
// @route  GET /api/songs/:id
// @access Public
exports.getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name image bio')
      .populate('album', 'title coverImage releaseDate');

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create new song
// @route  POST /api/songs
// @access Private/Admin
exports.createSong = async (req, res, next) => {
  try {
    const song = await Song.create(req.body);

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Added',
      details: `Song "${song.title}" added`,
      entityType: 'Song',
      entityId: song._id,
    });

    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update song
// @route  PUT /api/songs/:id
// @access Private/Admin
exports.updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Updated',
      details: `Song "${song.title}" updated`,
      entityType: 'Song',
      entityId: song._id,
    });

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete song
// @route  DELETE /api/songs/:id
// @access Private/Admin
exports.deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    await song.remove();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Deleted',
      details: `Song "${song.title}" deleted`,
      entityType: 'Song',
      entityId: song._id,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Increment song plays
// @route  PUT /api/songs/:id/play
// @access Private
exports.incrementPlays = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    await song.incrementPlays();

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle song like
// @route  PUT /api/songs/:id/like
// @access Private
exports.toggleLike = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    await song.toggleLike(req.user.id);

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get featured songs
// @route  GET /api/songs/featured
// @access Public
exports.getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({ featured: true })
      .populate('artist', 'name image')
      .populate('album', 'title coverImage');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (err) {
    next(err);
  }
}; 