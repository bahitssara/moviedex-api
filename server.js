require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./moviedex-data.json')
const app = express()
const PORT = 8000

app.use(morgan('dev'))

app.use(function validateBearerToken(req,res,next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    console.log('validate bearer token')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIES
    //get genres case insenstive 
    if (req.query.genre) {
        response = response.filter(movies => 
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    //get country case insenstive 
    if (req.query.country) {
        response = response.filter(movies => 
            movies.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }
    //get avg_votes that are greater than query/search  
    if (req.query.avg_vote) {
        response = response.filter(movies => 
            Number(movies.avg_vote) >= Number(req.query.avg_vote)
        )
    }

    res.json(response)
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})
