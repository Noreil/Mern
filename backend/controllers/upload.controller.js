const UserModel = require('../models/user.model')
const fs = require('fs')
const { promisify } = require('util')
const { uploadErrors } = require('../utils/error.utils')
const pipeline = promisify(require('stream').pipeline)

module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType !== 'image/jpg' && req.file.detectedMimeType !== 'image/jpeg' && req.file.detectedMimeType !== 'image/png')
            throw Error('Invalid file')
        
        if(req.file.size > 500000) throw Error('max size')
    } catch (err) {
        const errors = uploadErrors(err)
        return res.status(201).json({ errors })
    }

    const fileName = req.body.name + ".jpg"

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    )
    
    UserModel.findOneAndUpdate({ _id : req.body.userId},
        {
            $set: {picture: "./uploads/profil/" + fileName}
        }    
    )
    .then(() => res.status(200).json({ message : 'ok'}))
    .catch((err) => res.status(400).json({ message : 'ko'}))
}