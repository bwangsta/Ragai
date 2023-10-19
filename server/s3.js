const { S3, Credentials } = require("ibm-cos-sdk")

const s3 = new S3({
  endpoint: process.env.ENDPOINT,
  apiKeyId: process.env.API_KEY_ID,
  serviceInstanceId: process.env.SERVICE_INSTANCE_ID,
  credentials: new Credentials(
    process.env.ACCESS_KEY,
    process.env.SECRET_ACCESS_KEY,
    (sessionToken = null)
  ),
  signatureVersion: "v4",
})

module.exports = s3
