// server/src/index.ts
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import z from 'zod'

const app = express()
app.use(cors())
app.use(express.json())

// Conexão direta com PostgreSQL (nunca falha)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/rubricdb'
})

// Testa conexão no startup
pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message)
    process.exit(1)
  } else {
    console.log('Conectado ao PostgreSQL com sucesso!')
  }
})

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

// POST /rubrics — com transação explícita
app.post('/rubrics', async (req, res) => {
  const client = await pool.connect()
  try {
    const data = rubricSchema.parse(req.body)
    await client.query('BEGIN')

    const rubricRes = await client.query(
      'INSERT INTO "Rubric" (name, type) VALUES ($1, $2) RETURNING id',
      [data.name, data.type]
    )
    const rubricId = rubricRes.rows[0].id

    for (const crit of data.criteria) {
      const critRes = await client.query(
        'INSERT INTO "Criterion" (name, "order", "rubricId") VALUES ($1, $2, $3) RETURNING id',
        [crit.name, crit.order, rubricId]
      )
      const criterionId = critRes.rows[0].id

      for (const level of crit.levels) {
        await client.query(
          `INSERT INTO "Level" (label, points, description, "criterionId")
           VALUES ($1, $2, $3, $4)`,
          [level.label || null, level.points, level.description, criterionId]
        )
      }
    }

    await client.query('COMMIT')

    // Busca o resultado completo
    const result = await pool.query(`
      SELECT 
        r.*,
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'order', c."order",
            'levels', (
              SELECT json_agg(
                json_build_object('id', l.id, 'label', l.label, 'points', l.points, 'description', l.description)
              ) FROM "Level" l WHERE l."criterionId" = c.id
            )
          ) ORDER BY c."order"
        ) as criteria
      FROM "Rubric" r
      LEFT JOIN "Criterion" c ON c."rubricId" = r.id
      WHERE r.id = $1
      GROUP BY r.id
    `, [rubricId])

    res.status(201).json(result.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validação falhou', details: error.issues })
    }
    console.error(error)
    res.status(500).json({ error: 'Erro ao salvar rubrica' })
  } finally {
    client.release()
  }
})

// GET /rubrics
app.get('/rubrics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id, r.name, r.type, r."createdAt",
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'order', c."order",
            'levels', (
              SELECT json_agg(
                json_build_object('id', l.id, 'label', l.label, 'points', l.points, 'description', l.description)
                ORDER BY l.id
              ) FROM "Level" l WHERE l."criterionId" = c.id
            )
          ) ORDER BY c."order"
        ) as criteria
      FROM "Rubric" r
      LEFT JOIN "Criterion" c ON c."rubricId" = r.id
      GROUP BY r.id
      ORDER BY r."createdAt" DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar rubricas' })
  }
})

app.listen(3001, () => {
  console.log('API rodando em http://localhost:3001 (PostgreSQL puro)')
})