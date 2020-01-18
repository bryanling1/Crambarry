import React, {Component} from "react";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import {Link} from "react-router-dom";
import Sidenav from "./SideNav"
import SidenavOff from "./SideNavOff"

class Nav extends Component {
    componentDidMount(){
        document.title = "CramBarry";
      }
      state={
          sidenav: false
      }
      handleMenu = () =>{
          this.setState({
              sidenav: !this.state.sidenav
          })
      }
      handleCloseMenu = () =>{
          this.setState({
              sidenav: false
          })
      }
    render(){
        const {auth, profile} = this.props;
        const profileLobbies = (profile.firstName)? (profile.lobbynames):(null);
        const sidenavLinks = (profile.firstName)? ([{name: "My Profile", link:"profile/"+auth.uid}, {name: "Notifications", link: "notifications"}, {name: "Inventory", link: "inventory"}, {name: "Open Gifts", link: "gifts"}]):(null);
        const links = (profile.firstName)? (< SignedInLinks auth={auth} profile={profile}/>):(< SignedOutLinks/>);
        const sideNavData = (profile.firstName)?(<Sidenav profile={profile} auth={auth.uid} presents={profile.presents} sidenavLinks={sidenavLinks} profileLobbies={profileLobbies}/>):(<SidenavOff />);
        const sidenav = this.state.sidenav?(<div className="side-nav-close" onClick={this.handleCloseMenu}><div className="side-nav z-depth-1">{sideNavData}</div></div>):(null)
        return(
            profile && 
            <div className="nav home-fade">
         
            <link rel="shortcut icon" href="/images/cramberry.svg"/> 
            <nav className="white z-depth-0">
            <div className="menu-sidenav"onClick={this.handleMenu}>
            {
                profile.notifications &&
                profile.notificationsSeen &&
                profile.notifications !== null &&
                profile.notificationsSeen !== null && 
                profile.notifications !== profile.notificationsSeen ? (
                <div className="small-red-gift-number-icon-sidenav">
                        {profile.notifications - profile.notificationsSeen }
                </div>):(null)
            }
                <i id="left-menu-button" className="material-icons menu-left" >menu</i></div>
                <div className="nav-wrapper container">
               
                <Link to="/home" className="brand-logo white-text brand-color"><img id="nav-logo" alt="" src="/images/CLong.svg"/></Link>
                    {links}
                </div>
            </nav>

            {sidenav}
            
                        
            </div>
        );
    }
}

export default Nav