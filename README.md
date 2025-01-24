# Simple Spotify Wrapped

A simple web application that replicates the experience of Spotify Wrapped, displaying your most-played songs, artists, and other statistics based on your Spotify listening history.

## Features

- View your top songs and artists
- Interactive and responsive design
- Clean and simple user interface
- Displays personalized music statistics
- Integration with the Spotify API

## Getting Started 🚀

#### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v16 or later)
- npm or yarn
- A Spotify Developer Account

## Run Locally

Clone the Project

```bash
git clone https://github.com/cesarpizarra/spotify-wrapped
```

Navigate to the Project Directory

```bash
cd  spotify-wrapped
```

Install dependencies

```bash
npm install
```

Create a .env file in the root of your project and add the following variables:

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

Start the app

```bash
  npm run dev
```

Visit http://localhost:3000 in your browser!

## Setting Up Spotify API 🎵

To integrate Spotify API, follow these steps:

1.  Create a Spotify Developer Account

    - Go to [Spotify for Developers](https://developer.spotify.com/)
    - Log in or sign up for a Spotify Developer Account.

2.  Create a New App

    - Navigate to the Dashboard and click Create an App.
    - Fill out the form with your app's name and description.

3.  Configure Redirect URIs

    - Go to your app's settings.
    - Add your redirect URI under Redirect URIs (e.g., http://localhost:3000/callback).

4.  Get Your Client ID and Secret

    - In your app settings, you'll find the Client ID and Client Secret.
    - Copy these and add them to your .env file.

5.  Enable the Required Scopes
    When making requests to the Spotify API, ensure your app requests the following scopes:

          - user-read-private
          - user-read-email
          - user-top-read
          - user-read-currently-playing

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b new-branch`
3. Commit your changes: `git commit -m 'Add some branch'`
4. Push to the branch: `git push origin new-branch`
5. Submit a pull request :D

## License 📄

This project is licensed under the MIT License.

## Acknowledgments 🙌

Special thanks to the Spotify Developer API for making this app possible.
