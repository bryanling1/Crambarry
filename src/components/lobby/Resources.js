import React, {Component} from "react"
import ResourcesLinks from "./ResourcesLinks"
import ResourcesQuestions from "./ResourcesQuestions"
import ResourcesAdmins from "./ResourcesAdmins"
import ResourcesPlay from "./ResourcesPlay"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"
import LobbyNotifications from "./LobbyNotifications"
import Spritesheet from 'react-responsive-spritesheet';
import {level_background, exact_level, xp_subtract, early_levels} from "../class/Profile";

class Resources extends Component{
state={
    resourcesTab: this.props.target === "link" ?("Links"):(
        this.props.target === "question" ?("Questions"):(
            this.props.target === "admin" ?("Admins"):(
                "Play")
        )
    ),
    notifications: false
}
render(){
let x= this.props.user.xp && this.props.user.xp;
let levelProgress = (x-xp_subtract(x))%early_levels(x);
let levelProgressBar = Math.floor( levelProgress / early_levels(x) * 100);

const profile = this.props.user
const usersprite = profile && <div className="user-profile-preview-wrapper-resources"><div className="user-profile-preview-border-resources" style={{backgroundColor: level_background(profile.xp)}}><div className="user-profile-preview-resources">
<Spritesheet
    className={"sprite-profile sprite-body-index"}
    image={`/images/`+profile.itemBody+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-head-index"}
    image={`/images/`+profile.itemHead+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-desk-index"}
    image={`/images/`+profile.itemDesk+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-hat-index"}
    image={`/images/`+profile.itemHat+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-face-index"}
    image={`/images/`+profile.itemFace+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-legs-index"}
    image={"/images/"+profile.itemLegs+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/></div><div className="sprite-user-level-resources" style={{backgroundColor: level_background(parseInt(profile.xp))}}>{exact_level(profile.xp)}</div></div></div>
return(
<div className={"resources"} style={{opacity: this.props.toggleOpacity, visibility: this.props.toggleDisplay}} >
{/*notifications*/}

    {
            this.state.notifications && 
            <LobbyNotifications/>
        }
<div className="resources-nav z-depth-2">
<div className="notifications-resources" onClick={()=>{this.setState({notifications: !this.state.notifications})}}>
        
        {
            this.props.user.notifications &&
            this.props.user.notificationsSeen &&
            this.props.user.notifications !== null &&
            this.props.user.notificationsSeen !== null && 
            this.props.user.notifications !== this.props.user.notificationsSeen ? (
                <div className="small-red-gift-number-icon-resources">
                    {this.props.user.notifications - this.props.user.notificationsSeen }
                </div>
            ):(null)

        }
    <i className="material-icons" >notifications</i>
    { this.state.notifications && 
    <i className="material-icons small-notifications-arrow">arrow_drop_up</i>
    }
</div>
    <div className="resources-nav-head" style={{position: "relative"}}>
    {this.props.roomName}
        {
            usersprite
        }
    <div className={"progress progress-resources grey lighten-1"}><span className="white-text progress-amount progress-amount-resources">{levelProgress+"/"+early_levels(x)}</span>
    <div className="determinate" style={{ width : levelProgressBar+"%", zIndex: 80, position: "absolute", backgroundColor: level_background(profile.xp)}}></div>
    </div>
    </div>
    <div onClick={()=>{this.setState({resourcesTab: "Links"})}} className={this.state.resourcesTab === "Links"?("resources-nav-button grey-darken-5"):("resources-nav-button")} id="resources-resources">
        <i className={this.state.resourcesTab === "Links"?("blue-text  text-lighten-1 material-icons"):("material-icons")}>link</i>
        <p className={this.state.resourcesTab === "Links"?("blue-text  text-lighten-1"):(null)}>Resources</p>
        {
            this.props.lobbyData.linkNotifications !== this.props.users[this.props.userid].linksSeen?(
            <div id="resources-resources-noti" className="resources-nav-notifications">
                {this.props.lobbyData.linkNotifications - (this.props.users[this.props.userid].linksSeen?(this.props.users[this.props.userid].linksSeen):(0))}
            </div>):(null)
        }
    </div>
    <div onClick={()=>{this.setState({resourcesTab: "Questions"})}} className={this.state.resourcesTab === "Questions"?("resources-nav-button grey-darken-5"):("resources-nav-button")} id="resources-questions">
        <i className={this.state.resourcesTab === "Questions"?("amber-text text-darken-1 material-icons"):("material-icons")}>question_answer</i>
        <p className={this.state.resourcesTab === "Questions"?("amber-text  text-darken-1"):(null)}>Questions</p> 
        {
            this.props.lobbyData.questionNotifications !== this.props.users[this.props.userid].questionsSeen?(
            <div id="resources-questions-noti" className="resources-nav-notifications">
                {this.props.lobbyData.questionNotifications - (this.props.users[this.props.userid].questionsSeen?(this.props.users[this.props.userid].questionsSeen):(0))}
            </div>):(null)
        }
    </div>
    <div onClick={()=>{this.setState({resourcesTab: "Play"})}} className={this.state.resourcesTab === "Play"?("resources-nav-button grey-darken-5"):("resources-nav-button")} id="resources-play">
        <i className={this.state.resourcesTab === "Play"?("light-green-text text-accent-3 material-icons"):("material-icons")}>play_circle_outline</i>
        <p className={this.state.resourcesTab === "Play"?("light-green-text text-accent-3"):(null)}>Play</p> 
        {
            this.props.lobbyData.playNotifications !== this.props.users[this.props.userid].playsSeen?(
            <div id="resources-play-noti" className="resources-nav-notifications">
                {this.props.lobbyData.playNotifications - (this.props.users[this.props.userid].playsSeen?(this.props.users[this.props.userid].playsSeen):(0))}
            </div>):(null)
        }
    </div>
    <div onClick={()=>{this.setState({resourcesTab: "Admins"})}} className={this.state.resourcesTab === "Admins"?("resources-nav-button grey-darken-5"):("resources-nav-button")} id="resources-admin">
        <i className={this.state.resourcesTab === "Admins"?("red-text text-darken-2 material-icons"):("material-icons")}>assignment_ind</i>
        <p className={this.state.resourcesTab === "Admins"?("red-text text-darken-2"):(null)}>Admin</p> 
    </div>
    
</div>
<div className="resources-alt-close" onClick={()=>{ this.props.close() }}></div>
{
    this.state.resourcesTab === "Links"?(<ResourcesLinks target={this.props.target && this.props.target} lobbyData={this.props.lobbyData} isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} userlobbydata={this.props.userLobby} userid= {this.props.userid}user={this.props.user}roomName={this.props.roomName}></ResourcesLinks>):(null)
    
}
{
    this.state.resourcesTab === "Questions"?(<ResourcesQuestions   target={this.props.target && this.props.target}  lobbyData={this.props.lobbyData}isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} userlobbydata={this.props.userLobby} userid= {this.props.userid}user={this.props.user}roomName={this.props.roomName}></ResourcesQuestions>):(null)
}

{
    this.state.resourcesTab === "Admins"?(<ResourcesAdmins isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} lobbyData={this.props.lobbyData} users={this.props.users} userid= {this.props.userid} roomName={this.props.roomName}></ResourcesAdmins>):(null)
}

{
    this.state.resourcesTab === "Play"?(<ResourcesPlay userxp={this.props.user.xp} isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} lobbyData={this.props.lobbyData} users={this.props.users} userid= {this.props.userid} roomName={this.props.roomName}></ResourcesPlay>):(null)
}

</div>
)
}
} 
const mapStateToProps = (state, ownProps) =>{
    
    return{
        userLobby: state.firebase.data.lobbyusers && state.firebase.data["lobbyusers"][ownProps.roomName][ownProps.userid],
    }
}
export default compose(
    connect(mapStateToProps),
    firebaseConnect((props)=>{
        return[
            {path: "lobbyusers/"+props.roomName+"/"+props.userid},
        ]
    }),
    
)(Resources)