const { getUserId } = require('../utils')

const Query = {
  me: (parent, args, context) => {
    const userId = getUserId(context)
    return context.prisma.user({ id: userId })
  },
  feed: (parent, args, context) => {
    return context.prisma.posts()
  },
  getclass: (parent, args, context) => {
    const fragment = `
      fragment ClassWithUnit on Class {
        id
        name
        units {
          id
          unit
          lessons{
            id
            title
          }
        }
      }
      `
    return context.prisma.classes().$fragment(fragment)
  },
  unit: (parent, args, context) => {
    return context.prisma.units()
  },
  lesson: (parent, args, context) => {
    return context.prisma.lessons()
  },
  filterPosts: (parent, { searchString }, context) => {
    return context.prisma.posts({
      where: {
        OR: [
          {
            title_contains: searchString,
          },
          {
            content_contains: searchString,
          },
        ],
      },
    })
  },
  post: (parent, { id }, context) => {
    return context.prisma.post({ id })
  },
}

module.exports = {
  Query,
}
