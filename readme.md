
# **Music App**

This is a music app that allows users to search for songs, view song's details and create playlists. Users can search and retrieve songs from external API such as Spotify or LastFM. Users can also view the song's details like artist name, album, duration, etc. The song's data is stored in a MongoDB database and can be returned based on the search query.

The application also provides authentication and authorization features using Firebase Authentication and JSON Web Tokens.

postman collection link-https://www.postman.com/descent-module-architect-13586242/workspace/spotify-like-backend/collection/19587055-62db2e9f-a570-415c-84b7-de17c194a4b9?action=share&creator=19587055

**Api documentation with examples** https://documenter.getpostman.com/view/19587055/2s8ZDSdQyU

## **Features**

- Search and retrieve songs from the lastfm API
- View song details like artist name, album, duration, etc.
- Create and manage playlists
- Add songs to playlists
- Authentication and Authorization
- Pagination
- made an endpoint to dynamically generate preview images for songs using puppeteer(takes 500ms to send response with image) using inspiration from github og image generation


## **Api documentation with examples**
https://documenter.getpostman.com/view/19587055/2s8ZDSdQyU

![image](https://i.imgur.com/y1b0Bc0.png)

## **Getting Started**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites**

- NodeJS
- MongoDB
- LastFM API key

### **Installing**

- Install the dependencies

```bash
Copy code
npm install
```

- Create a .env file in the root directory of the project and add the following environment variables:

```
SPOTIFY_TOKEN=
JWT_SECRET=
MONGO_URI=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
LAST_FM=
```

- Start the development server

```
Copy code
npm run dev
```

## **API Routes**

## **Authentication Routes**

- **`POST /api/auth/register`**: Creates a new user with the information provided in the request body. Example: **`POST https://spotify-backend-e2jo.onrender.com/api/auth/register`**

- **`POST /api/auth/login`**: Authenticates an existing user with the email and password provided in the request body. Returns a JSON web token for the user. Example: **`POST https://spotify-backend-e2jo.onrender.com/api/auth/login`**

- **`POST /api/auth/forgot`**: Sends a password reset link to the email provided in the request body. Example: **`POST https://spotify-backend-e2jo.onrender.com/api/auth/forgot`**

- **`GET /api/auth/profile`**: Retrieves the profile of the currently logged in user. Example: **`GET https://spotify-backend-e2jo.onrender.com/api/auth/profile`**


### **Songs**

- **`GET /api/songs`**: Retrieves all the songs from the external API and stores them in the database then returns all the songs from database. Example: **`GET https://spotify-backend-e2jo.onrender.com/api/songs`**

- **`GET /api/songs/:id`**: Returns the song with the specified ID. Example: **`GET https://spotify-backend-e2jo.onrender.com/api/songs/5f9d0b9c1e0e9f1b8c8f1f2f`**

- **`GET /api/songs/search`**: Accepts a query parameter for the search term and returns a list of songs that match the search term. Example: **`GET https://spotify-backend-e2jo.onrender.com/api/songs/search?q=songname`**


### **Playlists**

- **`POST /api/playlists`**: Creates a new playlist with the information provided in the request body. Example: **`POST https://spotify-backend-e2jo.onrender.com/api/playlists`**

- **`GET /api/playlists`**: Retrieves a list of all playlists in the system. Example: **`GET https://spotify-backend-e2jo.onrender.com/api/playlists`**

- **`GET /api/playlists/:id`**: Retrieves the playlist with the specified ID. Example: **`GET https://spotify-backend-e2jo.onrender.com/api/playlists/5f9d0b9c1e0e9f1b8c8f1f2f`**

- **`PUT /api/playlists/:id`**: Updates the playlist with the specified ID using the information provided in the request body. Example: **`PUT https://spotify-backend-e2jo.onrender.com/api/playlists/5f9d0b9c1e0e9f1b8c8f1f2f`**

- **`DELETE /api/playlists/:id`**: Deletes the playlist with the specified ID. Example: **`DELETE https://spotify-backend-e2jo.onrender.com/api/playlists/5f6d8aa7c1331b5d5f5c5f5f`**

- **`POST /api/playlists/:id/songs`**: Adds a song to the playlist with the specified ID. The song information should be provided in the request body. Example: **`POST https://spotify-backend-e2jo.onrender.com/api/playlists/5f6d8aa7c1331b5d5f5c5f5f/songs`** with a body of **`{ "songId": "5f6d8aa7c1331b5d5f5c5f5f" }`**

- **`DELETE /api/playlists/:id/songs`**: Removes a song from the playlist with the specified ID. The song information should be provided in the request body. Example: **`DELETE https://spotify-backend-e2jo.onrender.com/api/playlists/5f6d8aa7c1331b5d5f5c5f5f/songs`** with a body of **`{ "songId": "5f6d8aa7c1331b5d5f5c5f5f" }`**


### database schema for three models: Playlist, Song, and User.

- The Playlist model has the following fields:
    - user_id: a reference to the user who created the playlist
    - name: the name of the playlist
    - description: a description of the playlist
    - songs: an array of references to songs in the playlist
    - created_at: the date and time when the playlist was created
    - updated_at: the date and time when the playlist was last updated
- The Song model has the following fields:
    - song_id: a unique identifier for the song
    - name: the name of the song
    - artist: the name of the artist of the song
    - album: the name of the album the song belongs to
    - duration: the duration of the song
    - preview_url: a url to a preview of the song
    - created_at: the date and time when the song was added to the database
    - updated_at: the date and time when the song's information was last updated
    
    the Song model has a text index on the name and artist fields.
    
- The User model has the following fields:
    - email: the email of the user
    - password: the hashed password of the user
    - role: the role of the user (either 'user' or 'admin')
    - created_at: the date and time when the user was created
    - updated_at: the date and time when the user's information was last updated

## **Built With** 

- **[NodeJS](https://nodejs.org/)**
- **[ExpressJS](https://expressjs.com/)**
- **[MongoDB](https://www.mongodb.com/)**
- **[Spotify API](https://developer.spotify.com/)**
- **[LastFM API](https://www.last.fm/api)**

