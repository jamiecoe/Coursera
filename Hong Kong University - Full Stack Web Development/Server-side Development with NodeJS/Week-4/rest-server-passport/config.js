// Configuration info
// If you need to make any changes to secret key or mongoURL, you only have to do it here
module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientID: '1081964821930906',
        clientSecret: 'c8282c3abd824fe8b607015ae0ab0c7f',
        callbackURL: 'https://localhost:3443/users/facebook/callback'
    }
}
