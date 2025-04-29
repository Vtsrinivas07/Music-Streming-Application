const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a playlist name'],
      trim: true,
      maxlength: [50, 'Playlist name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    coverImage: {
      type: String,
      default: 'default-playlist.jpg',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Set coverImage to first song's coverImage if not provided
PlaylistSchema.pre('save', async function (next) {
  if (this.isModified('songs') && this.songs.length > 0 && this.coverImage === 'default-playlist.jpg') {
    const Song = mongoose.model('Song');
    const firstSong = await Song.findById(this.songs[0]);
    if (firstSong && firstSong.coverImage) {
      this.coverImage = firstSong.coverImage;
    }
  }
  next();
});

module.exports = mongoose.model('Playlist', PlaylistSchema); 