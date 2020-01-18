import React, {Component} from "react";
import {connect} from "react-redux"
import {compose} from "redux"
import firebase from "firebase/app"
import {firebaseConnect} from "react-redux-firebase"


class Lobbies extends Component {
state = {
    online: 0
}

componentDidMount(){
    firebase.database().ref("lobbyusers/"+this.props.lobby).once("value").then(snapshot=>{
        var online = 0
        Object.values(snapshot.val()).forEach(data=>{
          //  if(data.status === "online"){
                online ++
          //  }
        })
        this.setState({online})
    })
}

render(){
    const onlineCheck = this.state.online > 0?(<div className="sidenav-lobby-online"></div>):(<div className="sidenav-lobby-offline"></div>);
return(
<a  href={"/lobby/"+this.props.lobby} key={this.props.lobby}>
<div className="sidenav-link-lobby">{this.props.lobby}
    <div className="sidenav-link-lobby-online">{onlineCheck}{this.state.online} Members</div>
    {
        this.props.lobbyNotis && this.props.ownLobbyNotis &&
        this.props.lobbyNotis.linkNotifications + 
        this.props.lobbyNotis.questionNotifications + 
        this.props.lobbyNotis.playNotifications - 
        (this.props.ownLobbyNotis.linksSeen?(this.props.ownLobbyNotis.linksSeen):(0)) -
        (this.props.ownLobbyNotis.questionsSeen?(this.props.ownLobbyNotis.questionsSeen):(0)) -
        (this.props.ownLobbyNotis.playsSeen?(this.props.ownLobbyNotis.playsSeen):(0)) !== 0?(
    <div className="sidenav-lobbynotis">
        {
        this.props.lobbyNotis && this.props.ownLobbyNotis &&
        this.props.lobbyNotis.linkNotifications + 
        this.props.lobbyNotis.questionNotifications + 
        this.props.lobbyNotis.playNotifications - 
        (this.props.ownLobbyNotis.linksSeen?(this.props.ownLobbyNotis.linksSeen):(0)) -
        (this.props.ownLobbyNotis.questionsSeen?(this.props.ownLobbyNotis.questionsSeen):(0)) -
        (this.props.ownLobbyNotis.playsSeen?(this.props.ownLobbyNotis.playsSeen):(0))
        }
    </div>):(null)
    }
</div>
</a>
)
}
}
const mapStateToProps = (state, ownProps) =>{
    return{
        lobbyNotis: state.firebase.data.lobbyData && state.firebase.data.lobbyData[ownProps.lobby],
        ownLobbyNotis: state.firebase.data.lobbyusers && state.firebase.data.lobbyusers[ownProps.lobby] && state.firebase.data.lobbyusers[ownProps.lobby][state.firebase.auth.uid]
    }
}
export default compose(
    connect(mapStateToProps),
    firebaseConnect((props)=>{
        return[
            {path: "lobbyData/"+props.lobby},
            {path: "lobbyusers/"+props.lobby+"/"+props.userID}
        ]
    }),
    )(Lobbies);