const PostModel = require('../models/post.model')
const UserModel = require('../models/user.model')
const ObjectID = require ('mongoose').Types.ObjectId
const { promisify } = require('util')
const fs = require('fs')
const { uploadErrors } = require('../utils/error.utils')
const pipeline = promisify(require('stream').pipeline)

module.exports.readPost = (req, res) => {
    PostModel.find().sort({ createdAt: -1 })
    .then(post => res.status(200).json({ post }))
    .catch(err => res.status(400).json({ message : "Error read" + err }))
}

module.exports.createPost = async (req, res) => {
    let fileName;

    if(req.file !== null) {
        try {
            if (req.file.detectedMimeType !== 'image/jpg' && req.file.detectedMimeType !== 'image/jpeg' && req.file.detectedMimeType !== 'image/png')
                throw Error('Invalid file')
            
            if(req.file.size > 500000) throw Error('max size')
        } catch (err) {
            const errors = uploadErrors(err)
            return res.status(201).json({ errors })
        }
        fileName = req.body.posterId + Date.now() + '.jpg'

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        )
    }

    const newPost = req.file ? new PostModel({
         ...req.body, picture: "/uploads/posts/" + fileName
    }) : new PostModel({ ...req.body })

    newPost.save()
    .then(() => res.status(200).json({ message : "Post créé"}))
    .catch(err => res.status(400).json({ message : 'Error create' + err }))
}

module.exports.updatePost = (req, res) => {
    PostModel.updateOne({ _id : req.params.id }, { ...req.body })
    .then(() => res.status(201).json({ message: "Post modifié"}))
    .catch(err => res.status(400).json({ message : 'Error update' + err }))
}

module.exports.deletePost = (req, res) => {
    PostModel.deleteOne({ _id : req.params.id })
    .then(() => res.status(200).json({ message: "Post supprimé "}))
    .catch(err => res.status(400).json({ message : 'Error delete' + err }))
}

module.exports.likePost = (req, res) => {
    if(!ObjectID.isValid(req.params.id) && !ObjectID.isValid(req.body.id)) {
        return res.status(400).send('ID unknow : ' + req.params.id + ' AND ' + req.body.id)
    }
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknow : " + req.params.id)
    }
    if(!ObjectID.isValid(req.body.id)){
        return res.status(400).send("ID unknow : " + req.body.id)
    }

    PostModel.findOne({ _id: req.params.id })
    .then(post => {
        if(!post.likers.includes(req.body.id)){
            PostModel.updateOne({ _id : req.params.id }, 
                {
                    $push: {likers : req.body.id}
                }
            )
            // .then((post) => res.status(201).json({post}))
            .catch(err => res.status(400).json({ message : 'err : like 1 : ' + err }))
        } else {
            res.status(400).json({ message : "Post déja liké 1"})
        }
    })
    .catch(err => res.status(400).json({err}))

    UserModel.findOne({ _id : req.body.id })
    .then(user => {
        if(!user.likes.includes(req.params.id)) {
            UserModel.updateOne({ _id: req.body.id },
                {
                    $push: {likes: req.params.id}
                }
            )
            .then((user) => res.status(201).json({user}))
            .catch(err => res.status(400).json({ message : 'err : like 2 : ' + err }))
        } else {
            res.status(400).json({ message : "Post déja liké 2"})
        }
    })
    .catch(err => res.status(400).json({err}))
}

module.exports.unlikePost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id)
    }

    PostModel.findOneAndUpdate({ _id: req.params.id },
        {
            $pull: {likers: req.body.id}
        }    
    )
    .then(() => res.status(201).json({message : " Post unliké"}))
    .catch(err => res.status(400).json({message: "Erro unlike 1 " + err}))

    UserModel.findOneAndUpdate({ _id: req.body.id },
        {
            $pull: {likes: req.params.id}
        }
    )
    // .then(() => res.status(201).json({message : " Post unliké"}))
    .catch(err => res.status(400).json({message: "Erro unlike 2" + err}))
}

module.exports.commentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id)
    }

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    // A tester avec ...
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if(!err) return res.send(docs)
                else return res.status(400).send(err)
            }
        )
    } catch (err) {
        return res.status(400).send(err)
    }
}

// Test middleware async avec mot clé async 

module.exports.editCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id)
    }

    try {
        return PostModel.findById(
            req.params.id,
            (err, docs) => {
                const theComment = docs.comments.find((comment) => 
                    comment._id.equals(req.body.commentId)
                )

                if(!theComment) return res.status(404).send('Comment not found')
                theComment.text = req.body.text;
                
                return docs.save((err) => {
                    if(!err) return res.status(200).send(docs)
                    return res.status(500).send(err)
                })
            }
        )
    } catch (err) {
        return res.status(400).send(err)
    }
}

module.exports.deleteCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id)
    }

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { 
                    comments : {
                        _id: req.body.commentId,
                    }
                }
            },
            { new : true },
            (err, docs) => {
                if(!err) return res.status(200).send(docs)
                return res.status(400).json({ err })
            }
        )
    } catch (err) {
        res.status(400).json({ err })
    }
}