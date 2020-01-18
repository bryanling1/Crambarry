import React, {Component} from "react"
import {adminUser} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import {level_background, exact_level} from "../class/Profile"


class AddAdmin extends Component{
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
    this.props.banUser({lobby: this.props.roomName, userid: this.state.banID})
    this.props.backToAdmin()
}
render(){

return(
<div className="row">
{
            //ban user
            this.state.openBan && <div className="delete-link" >
                <div className="edit-comment-panel center ">
                    <h1>Give {this.state.banUser} Admin?</h1>
                    <form className="col s12 questions-response-form" onSubmit={this.handleBan}>
                        <div className="row">
                            <br/>
                            <button className=" btn green center">Yes</button><button onClick={()=>{this.setState({openBan: false})}} type="submit" className=" btn grey center">No</button>
                        </div>
                    </form>
                </div>
                <div className="close-edit-comment" onClick={()=>{this.setState({openBan: false})}}>

                </div>
            </div>
        }
<div className="col s12">
<p className="white-text" style={{cursor: "pointer"}}onClick={this.props.backToAdmin}>{"< Back to Admin"}</p>
<h5 className="white-text">Add an Admin</h5>
<table className="white-text">
<tbody>
{
Object.entries(this.props.users).map(data=>{
    //check to see if the user is an owner or admin
    //you cannot can these
    //if want to can admin, unadmin first
    if(this.props.lobbyData.admins && this.props.lobbyData.bannedUsers){
        if(this.props.lobbyData.owner[data[0]] || this.props.lobbyData.admins[data[0]] || this.props.lobbyData.bannedUsers[data[0]]){
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
        <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn green">Add</button></td>
        </tr>
        )
        }
    }else if (!this.props.lobbyData.admins && this.props.lobbyData.bannedUsers){
    //there are no amins
    if(this.props.lobbyData.owner[data[0]] || this.props.lobbyData.bannedUsers[data[0]]){
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
        <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn green">Add</button></td>
        </tr>
        )
        }
    }else if (this.props.lobbyData.admins && !this.props.lobbyData.bannedUsers){
    //there are no banned users
    if(this.props.lobbyData.owner[data[0]] || this.props.lobbyData.admins[data[0]]){
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
        <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn green">Add</button></td>
        </tr>
        )
        }
    }else{
        //there are no admins or banned users
         //there are no banned users
        if(this.props.lobbyData.owner[data[0]] || this.props.lobbyData.admins[data[0]]){
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
            <td style={{float: "right"}}><button  onClick={()=>{this.setState({openBan: true, banUser: data[1].username, banID: data[0]})}} className="btn green">Add</button></td>
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
        banUser: (data)=> {dispatch(adminUser(data))},
    }
}
export default connect(null, mapDispatchToProps)(AddAdmin)