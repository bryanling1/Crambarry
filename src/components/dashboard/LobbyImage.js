import React, {Component} from "react"
import firebase from "firebase/app"
import {Link} from "react-router-dom"

class LobbyImage extends Component{
state = {
    data: null
}
componentDidMount(){
firebase
.database()
.ref("lobbyData/"+this.props.lobby)
.once("value")
.then(doc=>{
this.setState({data: doc.val()});
}).then(()=>{
//get the author of the lobby data
const authorid = Object.keys(this.state.data.owner)[0];
firebase
.database()
.ref("users/"+authorid )
.once("value")
.then(doc=>{
this.setState({
authorUsername: doc.val().username,
authorProfile: doc.val().profilePicture || "default.png",

})
}).then(()=>{
firebase.database().ref("lobbyusers/"+this.props.lobby).once("value").then(data=>{
this.setState({
members: data.val() && Object.keys(data.val()).length,
notificationsSeen:   (data.val()[this.props.userid].linksSeen +
                        data.val()[this.props.userid].questionsSeen + 
                        data.val()[this.props.userid].playsSeen) || 0
})
})
})
});
}
render(){
    //calculate the number of notifcations to be displayed
    const notifcationNumber = this.state.data && this.state.notificationsSeen && 
    this.state.data.linkNotifications + this.state.data.questionNotifications + this.state.data.playNotifications
    -this.state.notificationsSeen
return (
    <Link key={this.props.lobby} to={"/lobby/"+this.props.lobby}>
    <div className="col s12 m4">
    <div className="card z-depth-0">
    <div className="lobby-card-online-wrapper">
        <div className="lobby-card-online-circle"></div>
        <div className="lobby-card-online-text">{this.state.members && this.state.members} Members</div>
            { 
                notifcationNumber > 0 &&
                <div className="lobby-card-online-notifications">{
                notifcationNumber
                }
                </div>
            }
        <i className="material-icons">{notifcationNumber > 0 ? ("notifcations"):("notifications_none")}</i>
    </div>
    <img style={{borderRadius: "3px"}} alt={this.props.lobby} width="100%"src={this.state.data && "/images/backgrounds/"+this.state.data.image}/>
    <div className="card-action lobby-card-action">
        <div className="lobby-card-profile" style={this.state.authorProfile && {backgroundImage: 'url("/images/profile/'+this.state.authorProfile+'")'}}></div>
        <div className="lobby-card-text">
            <h1>{this.state.data && this.state.data.name}</h1>
            <h2>{this.state.authorUsername && this.state.authorUsername}</h2>
        </div>
        
    </div>
    </div>
    </div>
    </Link>
)

}}

export default LobbyImage;