import React from "react"
import {Link} from "react-router-dom"

const SignedOutLinks = () =>{
    return(
        <ul className="right  hide-on-med-and-down">
        <li><Link to="/login" className="black-text">Login</Link></li>
        <li><Link to="/signup" className="black-text">Signup</Link></li>
        </ul>
    )
}

export default SignedOutLinks; 