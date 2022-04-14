import React from 'react'
import Log from '../components/Log'

export default function Profil() {
  return (
    <div className='profil-page'>
        <div className='log-container'>
            <Log />
            <div className='img-container'>
                <img src="./img/log.svg" alt="img-log"/>
            </div>
        </div>
    </div>
  )
}
