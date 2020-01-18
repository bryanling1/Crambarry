import React from "react"
import {Link} from "react-router-dom"

const SignedInLinksSide = () =>{
    return(
        <div>
        <li><Link to="/">My Profile</Link></li>
        <li><Link to="/">Inventory</Link></li>
        <li><Link to="/">Lobbies</Link></li>
        <li><Link to="/">Logout</Link></li>
        </div>
    )
}

export default SignedInLinksSide; 