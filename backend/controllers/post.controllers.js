const PostModel = require('../models/post.model')
const UserModel = require('../models/user.model')
const ObjectID = require ('mongoose').Types.ObjectId

module.exports.readPost = (req, res) => {
    PostModel.find()
    .then(post => res.status(200).json({ post }))
    .catch(err => res.status(400).json({ message : "Error read" + err }))
}

module.exports.createPost = (req, res) => {
    const newPost = new PostModel({ ...req.body })
    console.log(req.body)
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
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id)
    }

    PostModel.findOne({ _id: req.params.id })
    .then(post => {
        if(!post.likers.includes(req.body.id)){
            PostModel.updateOne({ _id : req.body.id }, 
                {
                    $push: {likers : req.body.id}
                }
            )
        } else {
            res.status(400).json({ message : "Déja liké"})
        }
    })
    .catch(err => res.status(400).json({err}))

    UserModel.findOne({ _id : req.body.id })
    .then(user => {
        if(!user.likes.includes(req.body.id)) {
            UserModel.updateOne({ _id: req.body.id },
                {
                    $push: {likes: req.body.id}
                }
            )
        } else {
            res.status(400).json({ message : "Déja liké"})
        }
    })
    .catch(err => res.status(400).json({err}))
}

module.exports.unlikePost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknow : " + req.params.id)
    }
}