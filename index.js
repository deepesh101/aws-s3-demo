const express = require('express')
const AWS = require('aws-sdk')
const multer = require('multer')
const app = express()
app.use(express.static(__dirname + '/public'))
app.use(express.json())
require('dotenv').config()
const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION } = process.env
const S3Client = new AWS.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    Bucket: AWS_BUCKET_NAME,
    region: AWS_REGION
})

const upload = multer({
    storage: multer.memoryStorage({
        destination: (req, file, cb) => {
            cb(null, '');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    })
})

const Success = data => {
    return {
        success: true,
        date: new Date(),
        data
    }
}

const Fail = error => {
    return {
        success: false,
        date: new Date(),
        error
    }
}

app.get('/files', (req, res) => {
    S3Client.listObjects(
        {
            Bucket: AWS_BUCKET_NAME
        },
        (err, data) => {
            if (err) {
                res.status(500).json(Fail(err))
            } else {
                res.status(200).json(Success(data.Contents.map(c => ({ fileName: c.Key, fileSize: c.Size, lastModified: c.LastModified }))))
            }
        }
    )
})

app.get('/signedURL/:file', (req, res) => {
    res.status(200).json(Success(S3Client.getSignedUrl('getObject', {
        Bucket: AWS_BUCKET_NAME,
        Key: req.params.file,
        Expires: 60000
    })))
})

app.post('/upload', upload.single('file'), (req, res) => {
    S3Client.upload(
        {
            Key: req.file.originalname,
            Body: req.file.buffer,
            Bucket: AWS_BUCKET_NAME
        },
        {
            partSize: 5 * 1024 * 1024,
            queueSize: Math.ceil(req.file.size / (5 * 1024 * 1024))
        },
        (err, data) => {
            if (err) {
                res.status(500).json(Fail(err))
            } else {
                res.status(200).json(Success(data.Key))
            }
        }
    )
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`)
})
