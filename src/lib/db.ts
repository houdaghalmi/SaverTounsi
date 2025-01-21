import prisma from "./prisma"

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  } catch (error) {
    return null
  }
}

export async function createUser(data: {
  email: string
  password: string
  name?: string
}) {
  try {
    const user = await prisma.user.create({
      data,
    })
    return user
  } catch (error) {
    return null
  }
}

export async function updateUser(id: string, data: {
  name?: string
  email?: string
  password?: string
}) {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    })
    return user
  } catch (error) {
    return null
  }
}
