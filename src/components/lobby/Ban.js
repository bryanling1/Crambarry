import React, {Component} from "react"
import {banUser} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import {level_background, exact_level} from "../class/Profile"


class Ban extends Component{
state={
    openBan: false
}
handleChange = (e) =>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
handleBan = (e) =>{
    e.preventDefault()
    this.props.banUser({lobby: this.props.roomName, userid: this.state.banID, reason: this.state.reason})
    this.props.backToAdmin()
}
render(){

return(
<div className="row">
{
            //ban user
            this.state.openBan && <div className="delete-link" >
                <div className="edit-comment-panel">
                    <h1>Ban {this.state.banUser}?</h1>
                    <form className="col s12 questions-response-form" onSubmit={this.handleBan}>
                        <div className="row">
                            <div className="input-field col s12">
                            <input placeholder="(Reason)"id="reason" type="text" value={this.state.reason}onChange={this.handleChange}/>
                            </div>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Spam"})}} name="group1" type="radio" />
                                    <span>Spam</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Duplicate Account"})}}name="group1" type="radio" />
                                    <span>Duplicate Account</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Inappropriate User Data"})}} name="group1" type="radio" />
                                    <span>Inappropriate User Data</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Inappropriate Chat Language"})}} name="group1" type="radio" />
                                    <span>Inappropriate Chat Language</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Inappropriate Postings"})}} name="group1" type="radio" />
                                    <span>Inappropriate Postings</span>
                                </label>
                                </p>
                                <p>
                                <label>
                                    <input onClick={()=>{this.setState({reason: "Wrong Neighborhood"})}} name="group1" type="radio" />
                                    <span>Wrong Neighborhood</span>
                                </label>
                                </p>
                            <br/>
                            <button className=" btn red center">Yes</button><button onClick={()=>{this.setState({openBan: false})}} type="submit" className=" btn grey center">No</button>
                        </div>
                    </form>
                </div>
                <div className="close-edit-comment" onClick={()=>{this.setState({openBan: false})}}>

                </div>
            </div>
        }
<div className="col s12">
<p className="white-text" style={{cursor: "pointer"}}onClick={this.props.backToAdmin}>{"< Back to Admin"}</p>
<h5 className="white-text">Ban a User</h5>
<table className="white-text">
<tbody>
{
Object.entries(this.props.users).map(data=>{
    //check to see if the user is an owner or admin
    //you cannot can these
    //if want to can admin, unadmin first
    if(this.props.lobbyData.admins && this.props.lobbyData.bannedUsers){
        if(this.props.lobbyData.owner[data[0]] ||  this.props.lobbyData.admins[data[0]] || this.props.lobbyData.bannedUsers[data[0]]){
            return null
        }else{
        return(
            <tr key={data[0]}>
            <td><div className={"user-small-level lighten-2"}
            style={{backgroundColor: level_background(data[1].xp)}}>
            {exact_level(data[1].xp)}
            </div>
            </td>
            <td>{data[1].username}</td>
            <td>{data[1].name}</td>
            <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn red">ban</button></td>
            </tr>
        )
        }
    }else if (!this.props.lobbyData.admins && this.props.lobbyData.bannedUsers){
        //no admins so do not check for admins
        if(this.props.lobbyData.owner[data[0]] ||  this.props.lobbyData.bannedUsers[data[0]]){
            return null
        }else{
        return(
            <tr key={data[0]}>
            <td><div className={"user-small-level lighten-2"}
            style={{backgroundColor: level_background(data[1].xp)}}>
            {exact_level(data[1].xp)}
            </div>
            </td>
            <td>{data[1].username}</td>
            <td>{data[1].name}</td>
            <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn red">ban</button></td>
            </tr>
        )
        }
    }else if (this.props.lobbyData.admins && !this.props.lobbyData.bannedUsers){
        //no bans so do not check for bans
        if(this.props.lobbyData.owner[data[0]] ||  this.props.lobbyData.admins[data[0]]){
            return null
        }else{
        return(
            <tr key={data[0]}>
            <td><div className={"user-small-level lighten-2"}
            style={{backgroundColor: level_background(data[1].xp)}}>
            {exact_level(data[1].xp)}
            </div>
            </td>
            <td>{data[1].username}</td>
            <td>{data[1].name}</td>
            <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn red">ban</button></td>
            </tr>
        )
        }
    }
    else{
        //no bans or admins
        if(this.props.lobbyData.owner[data[0]]){
            return null
        }else{
        return(
            <tr key={data[0]}>
            <td><div className={"user-small-level lighten-2"}
            style={{backgroundColor: level_background(data[1].xp)}}>
            {exact_level(data[1].xp)}
            </div>
            </td>
            <td>{data[1].username}</td>
            <td>{data[1].name}</td>
            <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn red">ban</button></td>
            </tr>
        )
        }
    }
})
}
</tbody>
</table>

</div>
</div>
)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        banUser: (data)=> {dispatch(banUser(data))},
    }
}
export default connect(null, mapDispatchToProps)(Ban)