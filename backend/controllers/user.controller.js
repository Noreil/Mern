const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = (req, res) => {
    UserModel.find().select('-password') 
        .then((users) => res.status(200).json(users))
        .catch(err => res.status(400).json({ message : err }))
}

module.exports.getOneUsers = (req, res) => {
    console.log(req.params)
    // if(!ObjectID.isValid(req.params.id)) {
    //     return res.status(400).send('ID unknow : ' + req.params.id)
    // }
    UserModel.findOne({ _id: req.params.id }).select('-password')
        .then((user) => res.status(200).json(user))
        .catch(err => res.status(400).json({ message : err }))
}

module.exports.updateUser = (req, res) => {
    // if(!ObjectID.isValid(req.params.id)) {
    //     return res.status(400).send('ID unknow : ' + req.params.id)
    // }

    UserModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }).select('-password')
        .then((() => res.status(201).json({ message: 'User modify'})))
        .catch(err => res.status(400).json({ message : err }))
}

module.exports.deleteUser = (req, res) => {
    UserModel.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({ message : "Successfully deleted. "}))
        .catch(err => res.status(400).json({ message : err }))
    }

// Gérer pour add plusieurs id au tableau (voir avec les likes sur ancien projet)

module.exports.follow = (req, res) => {
    // Add to the follower list
    UserModel.findOne({_id: req.params.id }, { following: req.body.idToFollow })
        .then(() => res.status(201).json({ message: 'Add to follower list '}))
        .catch(err => res.status(400).json({ message : err }))

    // Add to the following list
    UserModel.findOne({_id: req.body.idToFollow }, { followers: req.params.id })
        // .then(() => res.status(201).json({ message : 'Add to following list'}))
        .catch(err => res.status(400).json({ message : err }))

}

module.exports.unfollow = (req, res) => {
    
}