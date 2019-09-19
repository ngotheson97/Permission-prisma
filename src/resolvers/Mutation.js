const { hash, compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { getUserId, APP_SECRET } = require('../utils')

const Mutation = {
  signup: async (parent, { name, email, password, role }, context) => {
    const hashedPassword = await hash(password, 10)
    const user = await context.prisma.createUser({
      name,
      email,
      role,
      password: hashedPassword,
    })
    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user,
    }
  },
  login: async (parent, { email, password }, context) => {
    const user = await context.prisma.user({ email })
    if (!user) {
      throw new Error(`No user found for email: ${email}`)
    }
    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      throw new Error('Invalid password')
    }
    return {
      token: sign({ userId: user.id }, APP_SECRET),
      user,
    }
  },
  createDraft: async (parent, { title, content }, context) => {
    return context.prisma.createPost({
      title,
      content,
    })
  },
  createUnit: async (parent, { unit, id_lesson }, context) => {
    return context.prisma.createUnit({
      unit,
      lessons: { connect: { id: id_lesson } },
    })
  },
  createLesson: async (parent, { title }, context) => {
    return context.prisma.createLesson({
      title
    })
  },
  createClass: async (parent, { name, id_unit }, context) => {
    return context.prisma.createClass({
      name,
      units: { connect: { id: id_unit } },
    })
  },
  deletePost: async (parent, { id }, context) => {
    return context.prisma.deletePost({ id })
  },
  publish: async (parent, { id }, context) => {
    return context.prisma.updatePost({
      where: { id },
      data: { published: true },
    })
  },
  setPermission: async (parent, { permission }, context) => {
    console.log('scret key:', APP_SECRET)
    return {
      token: sign({ permission: permission }, APP_SECRET),
      permission: permission,
    }
  },
}

module.exports = {
  Mutation,
}
