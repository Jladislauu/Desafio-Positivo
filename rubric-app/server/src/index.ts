// server/src/index.ts
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import z from 'zod'
import { prisma, initPrisma, setupPrismaShutdown } from './prisma'

const app = express()
app.use(cors())
app.use(express.json())

// Inicializa Prisma (única conexão gerenciada pelo Prisma)
initPrisma()
setupPrismaShutdown()

// Schema Zod (mesmo do antes)
const rubricSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['fixed', 'variable']),
  criteria: z.array(z.object({
    name: z.string().min(1),
    order: z.number().int(),
    levels: z.array(z.object({
      label: z.string().optional(),
      points: z.number().min(0),
      description: z.string()
    }))
  })).min(1)
})

// POST /rubrics — usando transação do Prisma
app.post('/rubrics', async (req, res) => {
  try {
    const data = rubricSchema.parse(req.body)
    const created = await prisma.$transaction(async (tx) => {
      return tx.rubric.create({
        data: {
          name: data.name,
          type: data.type,
          criteria: {
            create: data.criteria.map((c) => ({
              name: c.name,
              order: c.order,
              levels: {
                create: c.levels.map((l) => ({
                  label: l.label ?? null,
                  points: l.points,
                  description: l.description,
                })),
              },
            })),
          },
        },
        include: {
          criteria: {
            orderBy: { order: 'asc' },
            include: { levels: { orderBy: { id: 'asc' } } },
          },
        },
      })
    })

    res.status(201).json(created)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validação falhou', details: error.issues })
    }
    console.error(error)
    res.status(500).json({ error: 'Erro ao salvar rubrica' })
  }
})

// GET /rubrics
app.get('/rubrics', async (req, res) => {
  try {
    const rubrics = await prisma.rubric.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        criteria: {
          orderBy: { order: 'asc' },
          include: { levels: { orderBy: { id: 'asc' } } },
        },
      },
    })
    res.json(rubrics)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar rubricas' })
  }
})

app.listen(3001, () => {
  console.log('API rodando em http://localhost:3001 (Prisma)')
})