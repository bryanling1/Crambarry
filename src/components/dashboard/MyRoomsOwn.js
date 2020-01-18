import React, {Component} from "react"
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {compose} from "redux"
import {addLobby} from "../../store/actions/dashboardActions"
import LobbyImage from "./LobbyImage"
import {firebaseConnect} from "react-redux-firebase"

class MyRoomsOwn extends Component{
state={
    lobbyCode: "",
    alreadyIn: null
}
handleChange=(e)=>{
    this.setState({
        lobbyCode: e.target.value
    })
}
handleForm=(e)=>{
    e.preventDefault()
    if (this.state.lobbyCode !== "" ){
        this.props.addlobbyerr(this.state.lobbyCode)
    }
}
render(){
console.log(this.props)
let lobbyDisplay = this.props.usersinlobby ? (Object.keys(this.props.usersinlobby).map(lobby=>{
const enterButton = <div className="card-action"><Link to={"/lobby/"+lobby}>
<div className="btn green accent-4 ">ENTER</div></Link>
</div>

return (
<div key={lobby} className="col s12 m4">
<div className="card z-depth-1">
<div className="card-content">
<span className="card-title">
{lobby}
</span>
<LobbyImage lobby={lobby}/>
</div>

{enterButton}

</div>
</div>
)
})):(null)

if(lobbyDisplay  ===  null){
    lobbyDisplay = <p>Enter a lobby by code to join!</p>
}
    

const joinLobbyButton = <div className="row"><form className="col s12" >
<div className="input-field col s7 join-lobby-padding">
<input id="joinlobby" type="text" placeholder="Lobby Code" onChange={this.handleChange}/>
</div>
<input type="submit" value="JOIN" style={{cursory: "pointer"}} onClick={this.handleForm} className="btn green accent-4 join-lobby-button"/>
<p className="red-text error-join-lobby">{this.props.addlobbyerrmess}</p></form>
</div>

return(
<div className="RootDashboard">
<div className="container">
<div className="row">
<div className="join-lobby sign-in">

{joinLobbyButton}



</div>
<h5>Lobbies</h5>
{lobbyDisplay}
</div>
</div>
</div>)
}
}
const mapStateToProps = (state, props) =>{
    return{
        user: state.firebase.profile,
        auth: state.firebase.auth.uid,
        userData: state.firestore.ordered.users,
        addlobbyerrmess: state.dash.addlobby,
        usersinlobby: state.firebase.data.usersinlobby && state.firebase.data.usersinlobby[state.firebase.auth.uid]
    }
}
const dispatchToProps = (dispatch) =>{
    return{
        addlobbyerr: (code) => dispatch(addLobby(code))
    }
}
export default compose(
connect(mapStateToProps, dispatchToProps),
firebaseConnect((props)=>{
    return[
        {path: "/usersinlobby/"+props.auth},
    ]
}),
)(MyRoomsOwn);