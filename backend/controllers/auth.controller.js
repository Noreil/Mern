const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const { signUpErrors, signInErrors } = require('../utils/error.utils')

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
}

module.exports.signUp = async (req, res) => {
    console.log(req.body)
    const { pseudo, email, password } = req.body

    try {
        const user = await UserModel.create({ pseudo, email, password })
        res.status(201).json({ user: user._id })
    }
    catch(err) {
        const errors = signUpErrors(err)
        res.status(400).send({ errors })
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })
        res.status(200).json({user: user._id})
    } catch(err) {
        const errors = signInErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}