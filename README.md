# Permission prisma

## How to use

### 1. Download permission-prisma & install dependencies

Clone the repository:

````bash
git clone https://git.dora.edu.vn/sonn68/permission-prisma.git
````

Install Node dependencies:

````bash
cd permission-prisma
yarn install
````

### 2. Run

To run the permission-prisma

````bash
cd src
node index.js
````

## Steps *`Permission Prisma`*

### 1. Add library


````bash
yarn add graphql-shield
yarn add webtoken
````

### 1. Create file `permissions/index.js`

````
└── src
    ├── generated
    ├── permissions
    │    └── index.js
    ├── resolvers
    ├── index.js
    ├── schema.graphql.
    └──utils.js
````

### 2. Import `permission` into `src/index.js`


```jsx
const { permissions } = require('./permissions')
```
```jsx
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  middlewares: [permissions],
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

```

### 3. Create function `getPermission()` in utils.js

```jsx
const { verify } = require('jsonwebtoken')
const APP_SECRET = 'appsecret321'
```
```jsx
function getPermission(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET)
    return verifiedToken && verifiedToken.permission
  }
}
```
```jsx
module.exports = {
  getPermission
}
```

### 4. Edit file  permissions/index.js

- Import
```jsx
const { rule, and, shield } = require('graphql-shield')
const { getPermission } = require('../utils')

```

- Tạo rules phân quyền
```jsx
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
```

- Phân quyền cho từng model 
```jsx
const permissions = shield({
  Query: {
    me: rules.permissionView,
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
```
- Export 
```jsx
module.exports = {
  permissions,
}
```