import React, {Component} from "react";
import {Link} from "react-router-dom";

class SidenavOff extends Component {
  
    render(){
        return(
            <div className="Sidenav">
            <Link to={"/login"}><div className="sidenav-link">Login/Sign up</div></Link>
            </div>
        )
    }
}
export default SidenavOff;