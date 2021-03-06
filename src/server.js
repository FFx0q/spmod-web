const express = require('express')
const http = require('https')
const config = require('./config')
const morgan = require('morgan')

const server = async () => {
    const app = express()
    require('./store')

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.text())
    app.use(morgan('combined'))

    app.use('/static', express.static(config.staticDir))
    app.use('/build', express.static(config.buildsDir))
    require('./router')(app)
    
    const server = http.createServer(config.https, app)
    server.listen(config.port, () => console.info('Server started'))

    process.on('SIGTERM', () => {
        server.close(() => {
            console.log('HTTP Server closed.')
        })
    })
}

server().catch(error => console.error(error))
