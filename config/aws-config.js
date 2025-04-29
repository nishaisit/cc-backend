const AWS = require("aws-sdk");

AWS.config.update({region:"ap-south-1"}); //my region in aws

const s3 = new AWS.S3();
const S3_BUCKET = "nishyetbucket"; //mybucketname

module.exports = {s3, S3_BUCKET};