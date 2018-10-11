module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '41.79.78.61',
      username: 'tristan',
      // pem: './path/to/pem'
      password: '1234'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'ticketadmin',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      PORT: 3001,
      ROOT_URL: 'http://41.79.78.61',
      MONGO_URL: 'mongodb://mongodb:27017/ticketsalad'
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
      args: [
        '--link=mongodb:mongodb'
      ]
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },
};
