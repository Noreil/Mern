import React, { useState } from 'react'
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'

export default function Log() {
  const [signUpModal, setSignUpModal] = useState(true)
  const [signInModal, setSignInModal] = useState(false)

  const handleModals = (e) => {
    if(e.target.id === "register") {
      setSignInModal(false)
      setSignUpModal(true)
    } else if (e.target.id === "login") {
      setSignUpModal(false)
      setSignInModal(true)
    }
  }

  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li onClick={handleModals} id="register" className={signUpModal && "active-btn"}>S'inscrire</li>
          <li onClick={handleModals} id="login" className={signInModal && "active-btn"}>Se connecter</li>
        </ul>
        {signUpModal && <SignUpForm />}
        {signInModal && <SignInForm />}
      </div>
    </div>
  )
}
