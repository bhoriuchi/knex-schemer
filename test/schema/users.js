module.exports = {
  user: {
    id: {
      type: 'integer',
      primary: true,
      increments: true
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      nullable: true
    }
  }
}