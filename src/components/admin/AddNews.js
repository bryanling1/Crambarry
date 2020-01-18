import React, {Component} from "react"
import {connect} from "react-redux"
import {addNews} from "../../store/actions/adminActions"
import {Redirect} from "react-router-dom"

class AddNews extends Component{
state={
    title: null,
    image: null,
    content: null
}
handleSumbit = (e) =>{
    e.preventDefault()
    this.props.addNews(this.state)
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
    <h4 className="center">Add News To Database</h4>
    <p className="center">Add News Image to Public Folder Too</p>
    <form className="col s12" onSubmit={this.handleSumbit}>
    <div className="row">
    <div className="input-feild col s12">
        <label htmlFor="name" >Title</label>
        <input id="title"type="text" placeholder="Format: skelly-body-idle" onChange={this.handleChange} required/>
    </div>
    <div className="input-feild col s12">
        <label htmlFor="image" >Image</label>
        <input id="image"type="text" placeholder="with .png" onChange={this.handleChange} required/>
    </div>
    <div className="input-feild col s12">
        <label htmlFor="content" >Content</label>
        <textarea id="content"type="text" placeholder="html format" onChange={this.handleChange} style={{height:"400px" }} required/>
    </div>
    </div>
   <button className="btn blue">Post</button>
    </form>
    <p style={{color:  statusColor}}>{status}</p>
</div>
</div>
)
}
}
const mapStateToProps = (state) =>{
    return{
        auth: state.firebase.auth.uid
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        addNews: (itemData) => dispatch(addNews(itemData))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddNews)