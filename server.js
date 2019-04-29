require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./moviedex-data.json')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const PORT = process.env.PORT || 8000
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())


app.use(function validateBearerToken(req,res,next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

app.use((error, req, res, next) => {
    let response 
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error'}}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIES
    //get genres-case insenstive 
    if (req.query.genre) {
        response = response.filter(movies => 
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    //get country-case insenstive 
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
