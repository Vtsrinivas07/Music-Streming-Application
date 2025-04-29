require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Playlist = require('../models/playlist.model');
const bcrypt = require('bcryptjs');

async function runSeed() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beatbox', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Song.deleteMany({});
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Playlist.deleteMany({});

        console.log('Cleared existing data');

        // Create admin user
        const plainPassword = 'admin123';
        // Let the User model handle the hashing
        const admin = await User.create({
            username: 'admin',
            email: 'admin@beatbox.com',
            password: plainPassword,
            role: 'admin',
            profilePicture: 'https://example.com/admin.jpg'
        });

        console.log('Created admin user with ID:', admin._id);
        
        // Test admin login
        const testAdmin = await User.findOne({ email: 'admin@beatbox.com' }).select('+password');
        if (testAdmin) {
            const isMatch = await bcrypt.compare(plainPassword, testAdmin.password);
            console.log('Password match test:', isMatch ? 'SUCCESS' : 'FAILED');
        } else {
            console.log('Failed to find admin user for password test');
        }

        // Create sample artists
        const artists = await Artist.insertMany([
            {
                name: 'Sample Artist 1',
                bio: 'This is a sample artist bio',
                image: 'https://example.com/artist1.jpg',
                addedBy: admin._id
            },
            {
                name: 'Sample Artist 2',
                bio: 'Another sample artist bio',
                image: 'https://example.com/artist2.jpg',
                addedBy: admin._id
            }
        ]);

        console.log('Created sample artists');

        // Create sample albums
        const albums = await Album.insertMany([
            {
                title: 'Sample Album 1',
                artist: artists[0]._id,
                releaseYear: 2023,
                cover: 'https://example.com/album1.jpg',
                addedBy: admin._id,
                genre: 'Pop',
                releaseDate: new Date('2023-01-01')
            },
            {
                title: 'Sample Album 2',
                artist: artists[1]._id,
                releaseYear: 2023,
                cover: 'https://example.com/album2.jpg',
                addedBy: admin._id,
                genre: 'Rock',
                releaseDate: new Date('2023-02-01')
            }
        ]);

        console.log('Created sample albums');

        // Create sample songs
        const songs = await Song.insertMany([
            {
                title: 'Sample Song 1',
                artist: artists[0]._id,
                album: albums[0]._id,
                duration: 180,
                audioUrl: 'C:\Users\Admin\beatbox-app\server\uploads\songs\song-english-edm-296526.mp3',
                addedBy: admin._id,
                audioFile: 'C:\Users\Admin\beatbox-app\server\uploads\songs\song-english-edm-296526.mp3',
                genre: 'Pop',
                likes: []
            },
            {
                title: 'Sample Song 2',
                artist: artists[1]._id,
                album: albums[1]._id,
                duration: 200,
                audioUrl: 'https://example.com/song2.mp3',
                addedBy: admin._id,
                audioFile: '/uploads/songs/song2.mp3',
                genre: 'Rock',
                likes: []
            }
        ]);

        console.log('Created sample songs');

        // Create sample playlist
        await Playlist.create({
            name: 'Sample Playlist',
            description: 'A sample playlist',
            user: admin._id,
            songs: [songs[0]._id, songs[1]._id],
            isPublic: true
        });

        console.log('Created sample playlist');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

runSeed(); 