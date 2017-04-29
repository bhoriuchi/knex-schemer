module.exports = {
  user: {
    table: {

    },
    columns: {
      id: {
        type: 'integer',
        primary: true,
        increments: true
      },
      name: {
        type: 'string'
      },
      description: {
        type: 'string',
        nullable: true
      }
    }
  }
}