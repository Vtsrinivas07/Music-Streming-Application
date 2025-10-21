const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a song title'],
      trim: true,
      maxlength: [100, 'Song title cannot be more than 100 characters'],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre'],
    },
    duration: {
      type: Number, // Duration in seconds
      required: [true, 'Please provide song duration'],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    coverImage: {
      type: String,
      default: 'default-cover.jpg',
    },
    audioFile: {
      type: String,
      required: [true, 'Please provide an audio file path'],
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with playlists
SongSchema.virtual('playlists', {
  ref: 'Playlist',
  localField: '_id',
  foreignField: 'songs',
  justOne: false,
});

// Increment play count
SongSchema.methods.incrementPlays = async function () {
  this.plays += 1;
  return this.save();
};

// Toggle like
SongSchema.methods.toggleLike = async function (userId) {
  const User = mongoose.model('User');
  const user = await User.findById(userId);

  const indexInLikes = this.likes.indexOf(userId);
  const indexInFavorites = user.favorites.indexOf(this._id);

  if (indexInLikes === -1) {
    // Like
    this.likes.push(userId);
    if (indexInFavorites === -1) {
      user.favorites.push(this._id);
    }
  } else {
    // Unlike
    this.likes.splice(indexInLikes, 1);
    if (indexInFavorites !== -1) {
      user.favorites.splice(indexInFavorites, 1);
    }
  }

  await user.save();
  return this.save();
};

module.exports = mongoose.model('Song', SongSchema); 