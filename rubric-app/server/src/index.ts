import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import z from 'zod';

const app = express();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Schema de validação (Zod para robustez)
const rubricSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['fixed', 'variable']),
  criteria: z.array(z.object({
    name: z.string().min(1),
    order: z.number(),
    levels: z.array(z.object({
      label: z.string().optional(),
      points: z.number().min(0),
      description: z.string()
    }))
  }))
});

// POST /rubrics - Salvar rubrica
app.post('/rubrics', async (req, res) => {
  try {
    const data = rubricSchema.parse(req.body);
    const rubric = await prisma.rubric.create({
      data: {
        name: data.name,
        type: data.type,
        criteria: {
          create: data.criteria.map(c => ({
            name: c.name,
            order: c.order,
            levels: {
              create: c.levels.map(l => ({
                label: l.label,
                points: l.points,
                description: l.description
              }))
            }
          }))
        }
      }
    });
    res.json(rubric);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// GET /rubrics - Listar todas (extra para robustez)
app.get('/rubrics', async (req, res) => {
  const rubrics = await prisma.rubric.findMany({
    include: { criteria: { include: { levels: true } } }
  });
  res.json(rubrics);
});

app.listen(3001, () => console.log('Server on port 3001'));