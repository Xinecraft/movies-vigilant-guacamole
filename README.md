# Movies Rating API
REST APIs for a movie review website like IMDB with following
features:
- Users should be able to register and login using email and password. Login API should
return a JWT token. Authorization for all other APIs should be done using this token.
 - A logged in user should be able to post movies with basic fields: title, description and
genre.
 - A logged in user can only update his own movies.
 - A logged in user can only delete his own movies.
 - A logged in user should be able to see a list of all movies with their respective average
ratings.
- A logged in user can rate any movie. Rating done by a user for a movie should only be
counted once in the average rating.

## Installation

1. Clone the Repo
   ```
   git clone https://github.com/Xinecraft/movies-vigilant-guacamole.git MoviesRatingApi
   ```

2. Copy .env.example to .env
   ```
   cd MoviesRatingApi
   cp .env.example .env
   ```

3. Create a database with a name(Eg: movies_rating) in Postgres and update the file `src/configs/development.json` to match your database and postgres credentials.

4. Install dependencies
   ```
   npm i
   ```

5. Start the development server
   ```
   npm run dev
   ```

Server should start in port 3000 if not changed from .env.

## Boilerpate
https://www.npmjs.com/package/typescript-express-starter

## Tested to run with
1. NodeJS 16
2. Postgres 12

# APIs
List of available endpoints

### Register
```
POST
http://localhost:3000/signup

Body
{
    "fullName": "John Doe",
    "email": "john.doe@test.com",
    "password": "password"
}
```

### Login
```
POST
http://localhost:3000/login

Body
{
    "email": "john.doe@test.com",
    "password": "password"
}
```

### Create Movie*
```
POST
http://localhost:3000/movies

Body
{
    "title": "Matrix",
    "genre": "Science",
    "description": "A random description"
}
```

### Get all Movies*
```
GET
http://localhost:3000/movies?page=1&perPage=10
```

### Get a Movie*
```
GET
http://localhost:3000/movies/1
```

### Update a Movie*
```
PATCH
http://localhost:3000/movies/1

Body
{
    "description": "Change the description"
}
```

### Delete a Movie*
```
DELETE
http://localhost:3000/movies/1
```

### Rate a Movie*
```
POST
http://localhost:3000/ratings

Body
{
    "movieId": 1,
    "rating": 40
}
```

\* -> Only authenticated access with token. 