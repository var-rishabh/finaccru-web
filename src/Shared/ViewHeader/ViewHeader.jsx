import React from 'react'
import logo from '../../assets/Icons/cropped_logo.svg'
import './ViewHeader.css'
const ViewHeader = ({title}) => {
    return (
        <div className="view__header">
            <img style={{ width: "9rem" }} src={logo} alt="logo" />
            <h1 className='view__header--head'>{title}</h1>
        </div>
    )
}

export default ViewHeader
