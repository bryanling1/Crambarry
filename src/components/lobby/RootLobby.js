import React, {Component} from "react"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"
import ScrollToBottom from 'react-scroll-to-bottom'
import {Redirect} from "react-router-dom"
import {sendChatMessage, offlineuser, updateXp, givePresent, subtractOnline, addOnline} from "../../store/actions/chatActions"
import LobbyInteract from "./LobbyInteract"
import LobbyOwnProfile from "./LobbyOwnProfile"
import {level_background} from "../class/Profile";
import Resources from "./Resources"
//import {hoursAgo} from "../class/Resources"

class RootLobby extends Component{
      
state = {
    message: null, //chat message
    roomName: this.props.match.params.id, 
    loadlobby: null,
    spam: false, //timer to send next chat message
    fullscreen: false, //toggle fullscreen mode
    checkDup: false, //only check for the duplicate window once
    toggleResourcesOpacity: this.props.match.params.target ? (1):(0),
    toggleResourcesDisplay: this.props.match.params.target ? ("visible"):("hidden"),
    LobbyOwnProfile: this.props.match.params.target ? (true):(false),
}
//toggle fullscreen
fullscreen = () =>{ 
// Get the documentElement (<html>) to display the page in fullscreen 
var elem = document.documentElement;
if(!this.state.fullscreen){
    if (elem.requestFullscreen) {
    elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
    }
}else{
    if (document.exitFullscreen) {
    document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
    }
}
this.setState({
    ...this.state,
    fullscreen: !this.state.fullscreen //toggle fullscreen
})

}
//change the state of the message when the text area is change
handleChange = (e) =>{
this.setState({
    message:e.target.value
})
}
//submit the chat message typed from the message state
handleSubmit = (e) =>{
e.preventDefault();//prevent default form submission
if(!this.state.spam){ //if spam is not true
    this.props.sendChatMessage(this.state);
    e.target.reset();
    //set the spam state so another message cannot be spent immediately
    this.setState({spam: true})
    //delay changin the state for a second before allowing another mesage
    setTimeout(()=>{this.setState({spam: false})},1000) 
}
}



//Submit chat message with keybaord enter
//same as submit through button
handleSubmitKey=(e)=>{
if(e.keyCode === 13 && e.shiftKey === false && this.state.spam === false) {
    e.preventDefault();
    if(this.state.message){
    if(this.state.message.length<250 && this.state.message.replace(/\s/g,'').length>0){ //prevent messages over 250 characters in length
        this.props.sendChatMessage(this.state);
    }}
    e.target.value = null //reset
    this.setState({message: null})
    this.setState({spam: true}) 
    setTimeout(()=>{this.setState({spam: false})},1000) //check for spam, delays for 1 second
}
}
//toggle resources open/close
openResources=()=>{
    this.setState({
        toggleResourcesOpacity: 1,
        toggleResourcesDisplay: "visible",
        LobbyOwnProfile: true
    })
}
closeResources=()=>{
    this.setState({
        toggleResourcesOpacity: 0,
        toggleResourcesDisplay: "hidden",
        LobbyOwnProfile: false
    })
}

componentWillReceiveProps(){
    var x = document.getElementById("loader"); 

//Check to see if the user has some other tab open

if(this.props.auth && this.props.user.isLoaded){  
    if(this.state.checkDup === false){ //only check for duplicates once
        if(this.props.user.inLobby){
            return window.location = "/lobbyerror"
        }else{
            this.setState({checkDup: true})
            this.props.offlineuser({lobby: this.props.match.params.id})
            this.props.addOnline({lobby: this.props.match.params.id});
        }

    } 
}
x.style.display = "none"; //unload the loader

//Switching rooms from this component does not unmount.
//So, if the url does not match the room's state, switch the room
if(this.state.roomName !== this.props.match.params.id){
    
    //subtract 1 of online from previous lobby
    this.props.subtractOnline({lobby: this.state.roomName}) 
    //Add 1 to current lobby
    this.props.addOnline({lobby: this.props.match.params.id})
    //update the lastactivity in the current lobby
    //set the state to the new room
    this.setState({
        roomName: this.props.match.params.id
    })
}
if(this.props.user.xp !== undefined){
    if(this.state.loadLobby !== this.props.match.params.id){
        this.props.addOnline({
            lobby: this.props.match.params.id
        })
        this.setState({
            loadLobby: this.props.match.params.id
        })

    }
}

//If the number oneline does not match the online users, update that number
//this only works if there is atleast one person in the lobby
//this.updateCorrectOnline();
x.style.display = "none";

}

componentDidMount(){
    document.getElementById("left-menu-button").setAttribute("style", "color: white!important")   
}
componentWillUnmount(){
    document.getElementById("left-menu-button").style.color = "#333"
    this.state.checkDup && this.props.subtractOnline({lobby: this.props.match.params.id})
}

render(){
const {chat, auth, lobbyimage, lobbyData} = this.props //set prop variables
if(!auth) {return <Redirect to="/login"/>} //redirect if not logged in
if(lobbyData&&lobbyData.bannedUsers &&lobbyData.bannedUsers[auth]){return <Redirect to={"/ban/"+lobbyData.bannedUsers[auth].reasoning}/>} //redirect if user is banned


//set the lobbie's background image
const lobbyBackground = lobbyimage && 
    <div key="1" className="lobby-image" style={{"backgroundImage": "url('/images/backgrounds/"+lobbyimage.image+"')"}}></div>
return(
<div className="root-lobby">
{/* Image Loader */}
<div className="center" id="loader">
    <br/><br/><br/>
    <div className="preloader-wrapper big active ">
    <div className="spinner-layer spinner-blue-only">
    <div className="circle-clipper left">
    <div className="circle"></div>
    </div><div className="gap-patch">
    <div className="circle"></div>
    </div><div className="circle-clipper right">
    <div className="circle"></div>
    </div>
    </div>
    </div>
</div>
{lobbyBackground}
{/*Resources component */}
<i className="material-icons resources-close" onClick={this.closeResources} style={{opacity: this.state.toggleResourcesOpacity, visibility: this.state.toggleResourcesVisibility}}>close</i>
{this.state.LobbyOwnProfile && 
this.props.lobbyData &&
this.props.users &&
<Resources target={this.props.match.params.target && this.props.match.params.target} isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} lobbyData={this.props.lobbyData} users={this.props.users} userid={this.props.auth}user={this.props.user} close={()=>{this.closeResources()}} roomName={this.state.roomName} toggleOpacity={this.state.toggleResourcesOpacity} toggleDisplay={this.state.toggleResourcesDisplay}/>}
{/*fullscreen button*/}
<i className="material-icons fullscreen-icon-lobby" onClick={this.fullscreen}>{this.state.fullscreen?("fullscreen_exit"):("fullscreen")}</i>
{/*container starts*/}
<div className="container">
{/*User's xp bar and level*/}
{!this.state.LobbyOwnProfile &&<LobbyOwnProfile props={this.props && this.props}/>}
<div className="row">
{/*Chat side*/}
<div className="col s12 m6">
{<div style={!this.state.LobbyOwnProfile?(null):({display: "none"})}className="chat-container" id="scroll-chat">
{/* Open Resources tab */}
<button className={"btn resources-btn pulse"} onClick={this.openResources} style={{backgroundColor: level_background(this.props.user.xp)}}>
    <i className="material-icons resources-folder-icon">folder_shared</i>
    {
        this.props.lobbyData && this.props.users && this.props.auth &&
        this.props.lobbyData.linkNotifications + 
        this.props.lobbyData.questionNotifications + 
        this.props.lobbyData.playNotifications - 
        (this.props.users[this.props.auth].linksSeen?(this.props.users[this.props.auth].linksSeen):(0)) -
        (this.props.users[this.props.auth].questionsSeen?(this.props.users[this.props.auth].questionsSeen):(0)) -
        (this.props.users[this.props.auth].playsSeen?(this.props.users[this.props.auth].playsSeen):(0)) !== 0?(
    <div className="user-gift-count">
        {this.props.lobbyData && this.props.users && this.props.auth &&
        this.props.lobbyData.linkNotifications + 
        this.props.lobbyData.questionNotifications + 
        this.props.lobbyData.playNotifications - 
        (this.props.users[this.props.auth].linksSeen?(this.props.users[this.props.auth].linksSeen):(0)) -
        (this.props.users[this.props.auth].questionsSeen?(this.props.users[this.props.auth].questionsSeen):(0)) -
        (this.props.users[this.props.auth].playsSeen?(this.props.users[this.props.auth].playsSeen):(0))
        }
    </div>):(null)
    }
</button>

{/* Use to scroll to bottom and not if user is looking at old text*/}

<ScrollToBottom scrollToBottom className="chat-text" mode={"bottom"}>
{chat && Object.values(chat).map(message=>{
        let nameWrap = message.textColor //get user's color
        //replace l so hello is not censored
        //idk why removing the word from the library does not work
        return(
            <p key={message.date}>
            <span className={nameWrap}>{message.user}</span>:{" "}
            {message.message && message.message}
            </p>
        )

})}
{
//last message
/*   
<p className="center grey-text text-lighten-1">{this.props.lobbyData && 
    this.props.lobbyData.lastMessage && 
    new Date()/1000 - new Date(this.props.lobbyData.lastMessage).getTime()/1000 > 60 &&
    "last message: "+hoursAgo(new Date(this.props.lobbyData.lastMessage).getTime()/1000)}</p>
*/
}
</ScrollToBottom>

{/* Chat message form */}
<form onSubmit={this.handleSubmit}>
    <label htmlFor="message"></label>
    <textarea id="message"  style={{"resize": "none", "fontFamily": "'Aldrich'"}} onChange={this.handleChange} onKeyDown={this.handleSubmitKey} placeholder="Say Something"></textarea>
    {/* Set the button's color to the bacgkround of the user */}
    <button className="btn send" style={{backgroundColor: level_background(this.props.user.xp)}}>Send</button>
</form>

</div> 
}
</div>{/* End of the col */}
{/* start of lobby avatars section*/}
<div className="col s12 m6">
{
    !this.state.LobbyOwnProfile && <LobbyInteract auth={this.props.auth} lobbyData={this.props.lobbyData} users={this.props.users}/>
}

</div>
</div>
</div>

</div>
)

}
}

const mapStateToProps = (state, ownProps) =>{
    
    return{
        user: state.firebase.profile, //firebase profile
        chat:  state.firebase.data.lobbies && state.firebase.data["lobbies"][ownProps.match.params.id],
        auth: state.firebase.auth.uid,
        lobbyimage: state.firebase.data.lobbyData && state.firebase.data.lobbyData[ownProps.match.params.id],
        lobbyData: state.firebase.data.lobbyData && state.firebase.data.lobbyData[ownProps.match.params.id],
        users: state.firebase.data.lobbyusers && state.firebase.data["lobbyusers"][ownProps.match.params.id],
        isOwner:  state.firebase.data.lobbyData &&  state.firebase.auth.uid && state.firebase.data.lobbyData[ownProps.match.params.id]["owner"][state.firebase.auth.uid] ? (true):(false),
        isAdmin:  state.firebase.data.lobbyData &&  state.firebase.auth.uid && state.firebase.data.lobbyData[ownProps.match.params.id]["admins"] && state.firebase.data.lobbyData[ownProps.match.params.id]["admins"][state.firebase.auth.uid] ? (true):(false),
        notifications: state.firebase.data.notifications && state.firebase.data.notifications[state.firebase.auth.uid]
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        sendChatMessage: (message) => {dispatch(sendChatMessage(message))},
        updateXp: (amount) =>{dispatch(updateXp(amount))},
        givePresent: (data)=>{dispatch(givePresent(data))},
        subtractOnline: (data)=>{dispatch(subtractOnline(data))},
        addOnline: (data)=>{dispatch(addOnline(data))},
        offlineuser: (data)=>{dispatch(offlineuser(data))},
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "lobbies/"+props.match.params.id,  queryParams: [ 'limitToLast=50' ] },
            {path: "lobbyData/"+props.match.params.id},
            {path: "lobbyusers/"+props.match.params.id},
            {path: "notifications/"+props.auth}
        ]
    }),
    
)(RootLobby);