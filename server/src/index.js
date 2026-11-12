import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import donorRoutes from './routes/donor.js'
import requestRoutes from './routes/requests.js';
import matchesRoutes from './routes/matches.js';

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Vitalis API is running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/donor', donorRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/matches', matchesRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
