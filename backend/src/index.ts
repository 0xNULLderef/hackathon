import express from 'express'
import cors from 'cors'

import routes from '@/routes'
import config from '@/config'
import * as DbService from '@/services/db'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', routes)

const server = app.listen(config.port, () => {
  console.log(`Backend listening at http://localhost:${config.port}`)
})

process.on('SIGINT', () => {
  DbService.close()
  server.close()
})
