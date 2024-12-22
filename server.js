const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
const { pool } = require('./src/lib/db');

dotenv.config();

const app = express();
const port = 3000;

// Setup the express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Setup EJS
app.use(express.static(path.join(__dirname, './public')));
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

// Spotify API configuration
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Variable to keep track of the previous track state
let previousTrackId = null;
let previousTrackName = null;
let isSongPlaying = false;
let previousTrackProgress = 0; // Track progress in ms

// Function to update the database when a track changes
async function updateCurrentTrack() {
  try {
    // Fetch the current track
    const currentTrack = await spotifyApi.getMyCurrentPlayingTrack();
    const track = currentTrack.body.item;

    if (track) {
      const currentTrackName = track.name; // Current track name
      const currentTrackId = track.id; // Current track ID
      const trackDuration = track.duration_ms; // Track duration in ms
      const trackProgress = track.progress_ms; // Track progress in ms

      // Check if the track has changed or if the song has ended
      if (
        currentTrackId !== previousTrackId ||
        (trackProgress >= trackDuration && isSongPlaying)
      ) {
        // If there's a previous track, update its play count (only if song was playing and not just paused)
        if (previousTrackId && isSongPlaying) {
          const [existingTrack] = await pool
            .promise()
            .query('SELECT * FROM plays WHERE song_name = ?', [
              previousTrackName,
            ]);

          if (existingTrack.length > 0) {
            // Increment the play count for the previous track
            await pool
              .promise()
              .query(
                'UPDATE plays SET play_count = play_count + 1 WHERE song_name = ?',
                [previousTrackName]
              );
          }
        }

        // Insert or update the current song in the database
        const [existingCurrentTrack] = await pool
          .promise()
          .query('SELECT * FROM plays WHERE song_name = ?', [currentTrackName]);

        if (existingCurrentTrack.length > 0) {
          // If the current song already exists, increment its play count
          await pool
            .promise()
            .query(
              'UPDATE plays SET play_count = play_count + 1 WHERE song_name = ?',
              [currentTrackName]
            );
        } else {
          // If it doesn't exist, insert it with a play count of 1
          await pool
            .promise()
            .query('INSERT INTO plays (song_name, play_count) VALUES (?, ?)', [
              currentTrackName,
              1,
            ]);
        }

        // Update previous track variables
        previousTrackName = currentTrackName;
        previousTrackId = currentTrackId;
      }

      // Track if the song is playing or paused
      isSongPlaying = currentTrack.is_playing;

      // Track the progress of the song (for determining if it has ended)
      previousTrackProgress = trackProgress;
    }
  } catch (error) {
    console.error('Error fetching current track:', error);
  }
}

// Set up a longer timer to check the current track (every 30 seconds)
setInterval(updateCurrentTrack, 30000); // 30000ms = 30 seconds

app.get('/login', (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(
    [
      'user-read-private user-read-email user-top-read user-read-currently-playing',
    ],
    'some-state'
  );
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Get access and refresh tokens from Spotify
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // Store the tokens in the session
    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;

    // Set the access token for future API calls
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect('/');
  } catch (error) {
    console.error('Error getting Tokens:', error);
    res.send('Error getting Tokens');
  }
});

app.get('/', async (req, res) => {
  try {
    if (!req.session.accessToken) {
      return res.redirect('/login');
    }

    spotifyApi.setAccessToken(req.session.accessToken);

    // Fetch the current track
    const currentTrackData = await spotifyApi.getMyCurrentPlayingTrack();
    const track = currentTrackData.body.item;

    // Fetch the top artists
    const topArtistsData = await spotifyApi.getMyTopArtists({ limit: 10 });
    const topArtists = topArtistsData.body.items;

    const userData = await spotifyApi.getMe();
    const userName = userData.body.display_name;

    if (req.xhr) {
      return res.json({ track, topArtists });
    }

    res.render('index', { userName, track, topArtists });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('index', { userName: '', track: null, topArtists: [] });
  }
});

app.get('/plays', async (req, res) => {
  try {
    const [results] = await pool
      .promise()
      .query(
        'SELECT song_name, play_count FROM plays ORDER BY play_count DESC LIMIT 15'
      );
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
