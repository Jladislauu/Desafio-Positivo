import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ['warn','error'] })

// Preserve singleton in dev/hot-reload
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function initPrisma() {
  try {
    await prisma.$connect()
    console.log('Conectado ao PostgreSQL via Prisma!')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Erro ao conectar via Prisma:', message)
    process.exit(1)
  }
}

export function setupPrismaShutdown() {
  const shutdown = async () => {
    try {
      await prisma.$disconnect()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('Erro ao encerrar Prisma:', message)
    } finally {
      process.exit(0)
    }
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
