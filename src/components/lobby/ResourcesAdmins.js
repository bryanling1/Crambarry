import React, {Component} from "react"
import {unbanUser, unAdmin} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import {level_background, exact_level} from "../class/Profile"
import Ban from "./Ban"
import AddAdmin from "./AddAdmin"

class ResourcesAdmins extends Component{
state={
    banUserWindow: false,
    addAdminWindow: false,
    unban: false,
    removeAdmin: false
}
handleUnban=(e)=>{
    e.preventDefault();
    this.props.unbanUser({lobby: this.props.roomName, userid: this.state.unbanID})
    this.setState({unban: false})
}
handleUnadmin=(e)=>{
    e.preventDefault();
    this.props.unAdmin({lobby: this.props.roomName, userid: this.state.unbanID})
    this.setState({removeAdmin: false})
}
render(){
return(
<div className="resources-links resources-admin">
<div className="resources-links-list-all ">
{
            //remove admin
            this.state.removeAdmin && <div className="delete-link" >
                <div className="edit-comment-panel">
                    <h1>Remove {this.state.unbanuser} from Admins?</h1>
                    <form className="col s12 questions-response-form center " onSubmit={this.handleUnadmin}>
                        <div className="row">
                            <br/>
                            <button className=" btn red center">Yes</button><button onClick={()=>{this.setState({removeAdmin: false})}} type="submit" className=" btn grey center">No</button>
                        </div>
                    </form>
                </div>
                <div className="close-edit-comment" onClick={()=>{this.setState({removeAdmin: false})}}>

                </div>
            </div>
}
{
            //un ban user
            this.state.unban && <div className="delete-link" >
                <div className="edit-comment-panel">
                    <h1>Un-Ban {this.state.unbanuser}?</h1>
                    <form className="col s12 questions-response-form center " onSubmit={this.handleUnban}>
                        <div className="row">
                            <br/>
                            <button className=" btn red center">Yes</button><button onClick={()=>{this.setState({unban: false})}} type="submit" className=" btn grey center">No</button>
                        </div>
                    </form>
                </div>
                <div className="close-edit-comment" onClick={()=>{this.setState({unban: false})}}>

                </div>
            </div>
}
{
        //ban a user
        this.state.banUserWindow && <Ban roomName={this.props.roomName}lobbyData={this.props.lobbyData} users={this.props.users} backToAdmin={()=>{this.setState({banUserWindow: false})}} />
}
{
        //ban a user
        this.state.addAdminWindow && <AddAdmin roomName={this.props.roomName}lobbyData={this.props.lobbyData} users={this.props.users} backToAdmin={()=>{this.setState({addAdminWindow: false})}} />
}
{!this.state.banUserWindow && !this.state.addAdminWindow && 
<div>
<div className="row">
<div className="col s12 m6">
<h5 className="white-text">Owner</h5>
<table className="white-text">
<tbody>
<tr>
    <td><div className={"user-small-level lighten-2"}
            style={{backgroundColor: level_background(this.props.users[Object.keys(this.props.lobbyData.owner)[0]].xp)}}>
        {exact_level(this.props.users[Object.keys(this.props.lobbyData.owner)[0]].xp)}
        </div>
    </td>
    <td>{this.props.users[Object.keys(this.props.lobbyData.owner)[0]].username}</td>
    <td>{this.props.users[Object.keys(this.props.lobbyData.owner)[0]].name}</td>
</tr>
</tbody>
</table>
</div>
<div className="col s12 m6" style={{position: "relative"}}>
<h5 className="white-text">Admins</h5>{
this.props.isOwner && 
<button onClick={()=>{this.setState({addAdminWindow: true})}} className="btn grey" style={{position: "absolute", top: "0", right: "0"}}>+ Admin</button>
}<table className="white-text">
<tbody>
{
    this.props.lobbyData.admins && Object.keys(this.props.lobbyData.admins).map(data=>{
    return(
    <tr key={data}>
    <td><div className={"user-small-level lighten-2"}
    style={{backgroundColor: level_background(this.props.users[data].xp)}}>
    {exact_level(this.props.users[data].xp)}
    </div>
    </td>
    <td>{this.props.users[data].username}</td>
    <td>{this.props.users[data].name}</td>
    <td>{this.props.isOwner && 
    <button onClick={()=>{this.setState({unbanID: data, removeAdmin: true, unbanuser: this.props.users[data].username})}} className="btn red darken-2">x</button>
    }</td>
    </tr>
    )
})
    
}
{
    this.props.lobbyData.admins?(null):("No Admins")
}
</tbody>
</table>
</div>
</div>
<div className="row" style={{position: "relative"}}>
<div className="col s12">
<h5 className="white-text">Banned Users</h5> {
(this.props.isOwner || this.props.isAdmin)?(
<button onClick={()=>{this.setState({banUserWindow: true})}}style={{position: "absolute", top: "12px", right: 0}}className="btn red">Ban a User</button>
):(null)}<table className="white-text">

<tbody>
{
    this.props.lobbyData.bannedUsers && Object.entries(this.props.lobbyData.bannedUsers).map(data=>{
    console.log(data)
    if (data[1].id){
    return(
    <tr key={data[0]}>
    <td><div className={"user-small-level lighten-2"}
    style={{backgroundColor: level_background(this.props.users[data[0]].xp)}}>
    {exact_level(this.props.users[data[0]].xp)}
    </div>
    </td>
    <td>{this.props.users[data[0]].username}</td>
    <td>{this.props.users[data[0]].name}</td>
    <td>{data[1].reasoning}</td>
    { this.props.isAdmin || this.props.isOwner?(<td style={{float: "right"}}>
        <button onClick={()=>{this.setState({unbanID: data[0], unban: true, unbanuser: this.props.users[data[0]].username})}}className="btn grey unbanButton">X</button>
        </td>):(null)}
    </tr>
    )
}else{
    return null
}
})
}
</tbody>
</table>
</div>
</div>
</div>
}
</div>
</div>

)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        unbanUser: (data)=> {dispatch(unbanUser(data))},
        unAdmin: (data)=> {dispatch(unAdmin(data))}
    }
}

export default connect(null, mapDispatchToProps)(ResourcesAdmins)