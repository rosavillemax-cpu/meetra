import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = Fastify({ logger: true })
const prisma = new PrismaClient()

app.register(cors, { origin: 'http://localhost:3000' })

app.get('/health', async () => {
  return { status: 'ok', app: 'meetra' }
})

// Kullanıcı oluştur
app.post('/users', async (req, reply) => {
  const { email, handle, timezone } = req.body as any
  const user = await prisma.user.create({
    data: { email, handle, timezone }
  })
  return user
})

// Kullanıcı getir
app.get('/users/:handle', async (req, reply) => {
  const { handle } = req.params as any
  const user = await prisma.user.findUnique({ where: { handle } })
  if (!user) return reply.status(404).send({ error: 'Kullanıcı bulunamadı' })
  return user
})

app.listen({ port: 3001 }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
})
