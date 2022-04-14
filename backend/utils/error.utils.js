module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: "" }

    if(err.message.includes("pseudo"))
        errors.pseudo = "Pseudo incorrect ou déja pris"

    if(err.message.includes("email"))
        errors.email = "Email incorrect"
    
    if(err.message.includes("password"))
        errors.password = "Le mot de passe doit faire 6 caractère minimum"

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.email = "Ce pseudo est déja utilisé"

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Cet email est déja utilisé"

    return errors
}

module.exports.signInErrors = (err) => {
    let errors = {email: '', password: ''}

    if(err.message.includes("email"))
        errors.email = "Email inconnu"

    if(err.message.includes("password"))
        errors.password = "Le mot de passe ne correspond pas"

    return errors
}

module.exports.uploadErrors = (err) => {
    let errors = {format: '', maxSize: ''}

    if(err.messsage.includes('Invalid file'))
        errors.format = "Format incompatible"

    if(err.messsage.includes('max file '))
        errors.maxSize = "Le fichier dépasse les 500 ko"

    return errors
}