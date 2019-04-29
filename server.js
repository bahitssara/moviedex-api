require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 8000


const validTypes = ['filmtv_ID', 'film_title', 'year', 'genre', 'duration', 'country', 'director', 'actors', 'avg_vote', 'votes']

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
    res.json(validTypes)
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})
