const AWS = require('@aws-sdk/client-dynamodb')
require('dotenv').config()


AWS.config.update({
    region: 'us-east-1',
    access_key: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
})

