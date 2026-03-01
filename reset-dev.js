/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany()
  console.log("Users in DB:", JSON.stringify(users, null, 2))

  // If the user wants to test setup again, find the dev user and clear their username
  const devUser = users.find(u => u.email === 'dev@biyeprofile.com')
  if (devUser && devUser.username) {
    console.log(`Resetting username for ${devUser.email}...`)
    await prisma.user.update({
      where: { email: devUser.email },
      data: { username: null }
    })
    console.log("Username cleared.")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
