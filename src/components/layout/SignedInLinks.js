import React from "react"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import Spritesheet from 'react-responsive-spritesheet';
import {level_background, exact_level} from "../class/Profile";

const SignedInLinks = (props) =>{
    return(
        <ul className="right  hide-on-med-and-down">
        <li className="nav-icon-width"><Link to={"/profile/"+props.auth.uid}><i className="material-icons nav-addloby">add_circle</i></Link></li>
        <li className="nav-icon-width"><Link to="/notifications">
          { 
          props.profile.notifications &&
          props.profile.notificationsSeen &&
          props.profile.notifications !== null &&
          props.profile.notificationsSeen !== null &&
          props.profile.notificationsSeen !== props.profile.notifications ?
          (<div className="user-gift-count">{props.profile.notifications - props.profile.notificationsSeen}</div>):(null) 
          }<i className="material-icons nav-addloby">notifications</i></Link></li>
        <li className="nav-icon-width"><div className="user-gift-count" style={{backgroundColor: level_background(props.profile.xp)}}>{exact_level(props.profile.xp)}</div><a className="blue-text" href={"/profile/"+props.auth.uid}><i className="material-icons nav-addloby">person</i></a></li>
        <li className="nav-icon-width"><Link  className="purple-text" to="/inventory"><i className="material-icons nav-addloby">work</i></Link></li>
        <li className="nav-icon-width"><Link to="/gifts">
        <div className="user-gift-count">{props.profile.presents}</div>
            <div className="nav-gifts">
            
            <Spritesheet
            className={"box-nav"}
            image={"../images/unbox.png"}
            widthFrame={224}
            heightFrame={224}
            steps={5}
            fps={3}
            autoplay={true}
            loop={true}
            />
            </div>
        </Link></li>
        </ul>
    )
}
const mapStateToProps=(state)=>{
    return{
      profile: state.firebase.profile
    }
  }
export default connect(mapStateToProps)(SignedInLinks); 