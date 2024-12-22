# Simple Spotify Wrapped

A simple web application that replicates the experience of Spotify Wrapped, displaying your most-played songs, artists, and other statistics based on your Spotify listening history.

## Features

- View your top songs and artists
- Interactive and responsive design
- Clean and simple user interface
- Displays personalized music statistics
- Integration with the Spotify API

## Run Locally

Clone the Project

```bash
    git clone https://github.com/cesarpizarra/spotify-wrapped
```

Create a .env

```
DB_HOST=your-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-db-name
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_REDIRECT_URI=your-spotify-redirect-uri
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SESSION_SECRET=your-session-secret
```

Navigate to the Project Directory

```bash
  cd  spotify-wrapped
```

Install dependencies

```bash
  npm install
```

Start the app

```bash
  npm run dev
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b new-branch`
3. Commit your changes: `git commit -m 'Add some branch'`
4. Push to the branch: `git push origin new-branch`
5. Submit a pull request :D
