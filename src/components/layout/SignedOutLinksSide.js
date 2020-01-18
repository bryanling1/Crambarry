import React from "react"
import {Link} from "react-router-dom"

const SignedOutLinksSide = () =>{
    return(
        <div>
        <li><Link to="/">Login</Link></li>
        <li><Link to="/">Signup</Link></li>
        </div>
    )
}

export default SignedOutLinksSide ; 