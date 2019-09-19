const { rule, and, shield } = require('graphql-shield')
const { getPermission } = require('../utils')

const rules = {
  permissionView: rule()((parent, args, context) => {
    const permission = getPermission(context)
    return permission === 'CUSTOMER' || permission === 'ADMIN'
  }),
  permissionAdmin: rule()((parent, args, context) => {
    const permission = getPermission(context)
    return permission === 'ADMIN'
  }),
}

const permissions = shield({
  Query: {
    filterPosts: rules.permissionView,
    post: rules.permissionView,
    feed: rules.permissionView,
  },
  Mutation: {
    createDraft: rules.permissionAdmin,
    deletePost: rules.permissionAdmin,
    publish: rules.permissionAdmin,
  },
})

module.exports = {
  permissions,
}
