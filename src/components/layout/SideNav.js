import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux"
import {compose} from "redux"
import {signOut} from "../../store/actions/authActions"
import Lobbies from "./lobbies"
import {firebaseConnect} from "react-redux-firebase"

class Sidenav extends Component {
    render(){
        const links = this.props.sidenavLinks.map(link=>{
            if(link.name === "Open Gifts"){
                return  <Link to={"/"+link.link} key={link.name}><div className="sidenav-link">{link.name}<div className="sidenav-presents">{this.props.presents}</div></div></Link>
            }else if (link.name === "My Profile"){
                return <a href={"/"+link.link}key={link.name}><div className="sidenav-link">{link.name}</div></a>
            }
            else if (link.name === "Notifications"){
                console.log(this.props.profile.notifications !== null &&
                    this.props.profile.notificationsSeen !== null)
                return <a href={"/"+link.link}key={link.name}><div className="sidenav-link">{link.name}
                    {
                        this.props.profile.notifications &&
                    this.props.profile.notificationsSeen &&
                    this.props.profile.notifications !== null &&
                    this.props.profile.notificationsSeen !== null &&
                    this.props.profile.notifications !== this.props.profile.notificationsSeen 
                     ?(
                    <div className="sidenav-presents">{
                        this.props.profile.notifications - this.props.profile.notificationsSeen  
                        }
                    </div>):(null)
                }</div></a>
            }else{
                return  <Link to={"/"+link.link} key={link.name}><div className="sidenav-link">{link.name}</div></Link>
            }
        })
        const lobbies = this.props.usersinlobby && Object.keys(this.props.usersinlobby).map(lobby=>{
            return  <Lobbies userID={this.props.auth} key={lobby} lobby={lobby}/>
        })
        return(
            
            <div className="Sidenav">
           {links}
           
           <div className="sidenav-lobbies-title" >Lobbies<Link to={"/profile/"+this.props.auth}><i  className="material-icons sidenav-addloby">add_circle</i></Link></div>
           {lobbies}
           
           <Link to="/login"><div className="signout-sidenav" onClick={this.props.signOut}>Sign Out</div></Link>
            </div>
        )
    }
}

const mapStateToProps = (state, props) =>{
    return{
        usersinlobby: state.firebase.data.usersinlobby && state.firebase.data.usersinlobby[props.auth]
    }
}
const mapDispatchToProps = (dispatch)=>{
    return{
        signOut: () => {dispatch(signOut())}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "usersinlobby/"+props.auth},
        ]
    }),
    )(Sidenav);