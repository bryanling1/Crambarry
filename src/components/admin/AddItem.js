import React, {Component} from "react"
import {connect} from "react-redux"
import {addItem} from "../../store/actions/adminActions"
import {Redirect} from "react-router-dom"

class AddItem extends Component{
state={
    name: null,
    tier: null,
    frames: null,
    fps: null,
    type: "default"
}
handleSumbit = (e) =>{
    e.preventDefault()
    this.props.addItem(this.state)
    e.target.reset()
}
handleChange = (e) =>{
    this.setState({
        ...this.state,
        [e.target.id]:e.target.value
    })
}
render(){
if(!this.props.auth || this.props.auth !== "kUJQ6VkWnydqoUZfHIp4lAf6uuG2") {return <Redirect to="/login"/>}
const {status, statusColor} = this.props
return(
<div className="add-item">
<div className="container">
    <h4 className="center">Add Item To Database</h4>
    <p className="center">Add Image to Public Folder Too</p>
    <form className="col s12" onSubmit={this.handleSumbit}>
    <div className="row">
    <div className="input-feild col s12">
        <label htmlFor="name" >Item name</label>
        <input id="name"type="text" placeholder="Format: skelly-body-idle" onChange={this.handleChange} required/>
    </div>
    </div>
    <div className="row">
    <div className="input-feild col s12">
        <label htmlFor="type" >Loot Box Type</label>
        <input id="type" type="text" value="default" onChange={this.handleChange} required/>
    </div>
    </div>
    <div className="row">
    <div className="input-feild col s4">
        <label htmlFor="tier">Tier</label>
        <input id="tier"type="number" placeholder="1,2,3,4" onChange={this.handleChange} required/>
    </div>   
    </div>
   <button className="btn blue">Add</button>
    </form>
    <p style={{color:  statusColor}}>{status}</p>
</div>
</div>
)
}
}
const mapStateToProps = (state) =>{
    return{
        status: state.admin.adminStatus,
        statusColor: state.admin.color,
        auth: state.firebase.auth.uid
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        addItem: (itemData) => dispatch(addItem(itemData))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddItem)