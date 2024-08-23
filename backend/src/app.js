import express from 'express'
import {createServer} from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieSession from 'cookie-session'
import io from './lib/websocket.js'
import routes from './routes/index.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const server = createServer(app)
app.use(cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('../frontend/dist'))
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../frontend/dist' })
})
app.get('/:path', (req, res) => {
    console.log(`React router path: ${req.params.path}`)
    res.sendFile('index.html', { root: '../frontend/dist' })
})
app.use('/api', routes)
io.attach(server)
const port = 5001
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
