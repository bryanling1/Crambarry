import React, {Component} from "react"
import {connect} from "react-redux"
import {compose} from "redux"
import {addLobby} from "../../store/actions/dashboardActions"
import LobbyImage from "./LobbyImage"
import {firebaseConnect} from "react-redux-firebase"

class MyRooms extends Component{
state={
    lobbyCode: "",
    alreadyIn: null,
    addcode: false
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
let lobbyDisplay = this.props.usersinlobby ? (Object.keys(this.props.usersinlobby).map(lobby=>{
return (
<LobbyImage userid = {this.props.auth}key= {lobby} lobby={lobby} isOwnProfile={this.props.isOwnProfile}/>
)
})):(null)

if(lobbyDisplay  ===  null){
    lobbyDisplay = <p>Enter a lobby by code to join!</p>
}
    

const joinLobbyButton = this.props.isOwnProfile?
(

/*<div className="row"><form className="col s12" >
<div className="input-field col s7 join-lobby-padding">
<input id="joinlobby" type="text" placeholder="Lobby Code" onChange={this.handleChange}/>
</div>
<input type="submit" value="JOIN" style={{cursory: "pointer"}} onClick={this.handleForm} className="btn green accent-4 join-lobby-button"/>
<p className="red-text error-join-lobby">{this.props.addlobbyerrmess}</p></form>
</div>
}*/
<div>
<input type="submit" value="+ADD A CLASS" style={{cursory: "pointer"}} onClick={()=>{this.setState({addcode: true})}} className="btn green accent-4 join-lobby-button"/>
</div>
):(null);

return(
<div className="RootDashboard">
{
    this.state.addcode &&
    //Add A classroom form
    <div className="use-code">
        <div className="use-code-form">
            <h1>Your Adventure Awaits!</h1><br/>
            <form onSubmit={this.handleForm} className="center">
                <input onChange={this.handleChange} placeholder="------" id="form" type="text"/>
                <br/>
                <p className="red-text">{this.props.addlobbyerrmess}</p>
                <button value="JOIN"className="btn-large green accent-4">JOIN</button>
            </form>
        </div>
        <div className="use-code-close" onClick={()=>{this.setState({addcode: false})}}></div>
    </div>
}
<div className="container">
<div className="row">
<div className="join-lobby sign-in">

{joinLobbyButton}

</div>
<h5>Classes</h5>
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
        addlobbyerrmess: state.dash.addlobby && state.dash.addlobby,
        usersinlobby: state.firebase.data.usersinlobby && state.firebase.data.usersinlobby[props.id]
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
        {path: "/usersinlobby/"+props.id},
    ]
}),
)(MyRooms);