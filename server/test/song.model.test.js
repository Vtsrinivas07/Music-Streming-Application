const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Song = require('../models/song.model');
const User = require('../models/user.model');

jest.setTimeout(30000);

describe('Song Model', () => {
  let mongoServer;
  let user;
  let song;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create a user and a song for testing
    user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    });
    await user.save();

    song = new Song({
      _id: new mongoose.Types.ObjectId(),
      title: 'Test Song',
      artist: new mongoose.Types.ObjectId(),
      genre: 'Test Genre',
      duration: 180,
      audioFile: 'test.mp3',
      addedBy: user._id,
    });
    await song.save();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
    await Song.deleteMany({});
  });

  it('should correctly toggle like and update favorites', async () => {
    // Initial state: song is not liked, user has no favorites
    expect(song.likes).not.toContainEqual(user._id);
    expect(user.favorites).not.toContainEqual(song._id);

    // Like the song
    await song.toggleLike(user._id);
    let updatedSong = await Song.findById(song._id);
    let updatedUser = await User.findById(user._id);

    // After liking: song is liked, song is in favorites
    expect(updatedSong.likes).toContainEqual(user._id);
    expect(updatedUser.favorites).toContainEqual(song._id);

    // Unlike the song
    await updatedSong.toggleLike(user._id);
    updatedSong = await Song.findById(song._id);
    updatedUser = await User.findById(user._id);

    // After unliking: song is not liked, song is not in favorites
    expect(updatedSong.likes).not.toContainEqual(user._id);
    expect(updatedUser.favorites).not.toContainEqual(song._id);
  });
});
