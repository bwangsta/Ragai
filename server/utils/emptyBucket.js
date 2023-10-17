// For development purposes only
async function emptyBucket(s3, bucketName) {
  try {
    const contents = await s3.listObjectsV2({ Bucket: bucketName }).promise()
    contents.Contents.map(async (content) => {
      await s3.deleteObject({ Bucket: bucketName, Key: content.Key }).promise()
    })
    console.log("Succesfully emptied bucket")
  } catch (e) {
    console.log(e)
  }
}

module.exports = emptyBucket
