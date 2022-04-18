const userModel = require('../models/user.model');
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


module.exports.follow = (req, res) => {
    userModel.findOne({ _id: req.params.id })
        .then(user => {
            // Verifie si l'id de idToFollow est valid (peut etre faire vérification sur l'id params ici aussi)
            if (!ObjectID.isValid(req.body.idToFollow)) {
                return res.status(400).send('ID unknoww : ' + req.body.idToFollow)
            }

            if(!user.following.includes(req.body.idToFollow)) {
                userModel.updateOne({ _id: req.params.id },
                    {
                        $push: {following: req.body.idToFollow}
                    }
                )
                .then(() => res.status(201).json({ message : 'Ajout dans following'}))
                .catch(err => res.status(400).json({ message : err }))   
            }else {
                return res.status(401).send('Déja dans la liste de follow 1')
            }
            if(!user.followers.includes(req.params.id) && !user.following.includes(req.body.idToFollow)) {
                userModel.updateOne({ _id: req.body.idToFollow },
                    {
                        $push: {followers: req.params.id}
                    }
                )
                // .then(() => res.status(201).json({ message : 'Ajout dans followers'}))
                .catch(err => res.status(400).json({ message : err }))   
            }else {
                return res.status(401).send('Déja dans la liste de follow 2')
            }
        })
}

module.exports.unfollow = (req, res) => {
    userModel.findOne({ _id: req.params.id })
        .then(user => {
            // Verifie si l'id de idToFollow est valid (peut etre faire vérification sur l'id params ici aussi)
            if (!ObjectID.isValid(req.body.idToUnfollow)) {
                return res.status(400).send('ID unknow : ' + req.body.idToUnFollow)
            }

            if(user.following.includes(req.body.idToUnfollow)) {
                userModel.updateOne({ _id: req.params.id },
                    {
                        // Personne que je suis
                        $pull: {following: req.body.idToUnfollow}
                    }
                )
                .then(() => res.status(201).json({ message : 'Unfollow'}))
                .catch(err => res.status(400).json({ message : "Unfollow 1" + err }))   
            }else {
                return res.status(401).send('Utilisateur non trouvé 1')
            }
            // if(user.followers.includes(req.params.id)) {
            userModel.updateOne({ _id: req.body.idToUnfollow },
                {
                    // Personne qui me suis
                    $pull: {followers: req.params.id}
                }
            )
            .then(() => res.status(201).json({ message : 'Unfollow'}))
            .catch(err => res.status(400).json({ message : "Unfollow 1" + err }))
            // }else {
            //     return res.status(401).send('Utilisateur non trouvé 2')
            // }
        })
}