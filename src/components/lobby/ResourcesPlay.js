import React, {Component} from "react"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"
import {createUnit, deleteUnit, editUnit, updateNotificationsSeen} from "../../store/actions/resourcesActions"
import {hoursAgo} from "../class/Resources"
import PlayOne from "./PlayOne"

class ResourcesPlay extends Component{
state={
    createSetForm: false, 
    deleteUnit: false,
    unitName: "efs",
    deleteUnitName: "",
    editUnit: false,
    openUnit: false //opens the questions from the unit component
}
handleSubmit = (e)=>{
    e.preventDefault();
    if(this.state.unitColor && this.state.setName){
        this.props.createUnit({lobby: this.props.roomName, color: this.state.unitColor, name: this.state.setName})
    }
    this.setState({createSetForm: false, unitColor: null})
}
handleChange = (e) =>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
handleDeleteUnit = (e) =>{
    e.preventDefault();
    if(this.state.setName === this.state.unitName){
        this.props.deleteUnit({lobby: this.props.roomName, unitID: this.state.deleteUnitID})
        this.setState({deleteUnit: false})
    }
    
}
handleEditUnit = (e) =>{
    e.preventDefault();
    if(this.state.editUnitName && this.state.unitColor){
        this.props.editUnit({lobby: this.props.roomName, unitID: this.state.editUnitID, color: this.state.unitColor, name: this.state.editUnitName})
        this.setState({editUnit: false, unitColor: null})
    }
}
render(){
return(
this.state.openUnit?(
    <PlayOne updateNotificationsSeen={()=>{this.props.updateNotificationsSeen({lobby: this.props.roomName, userID: this.props.userid, notificationType: "playsSeen", totalNotifications: this.props.lobbyData.playNotifications})}}lobbyData={this.props.lobbyData} userxp={this.props.userxp}unit={this.props.sets} isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} userID={this.props.userid} roomName={this.props.roomName} unitID={this.state.unitID} backToUnits={()=>{this.setState({openUnit: false})}}/>
):(
<div className="resources-links-list-all">
{
    //create a unit
            this.state.createSetForm && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-play-form">
            <h1>Create a Unit</h1>
            <p>Multiple Choice and Short Answer Practice</p>
            <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="input-field col s12">
                    <input  id="setName" type="text" onChange={this.handleChange}/>
                    <label htmlFor="setName">Unit Name</label>
                    </div>
                    <div className="row">
                    <div className="input-field col s6 m4">
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#e53935"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#e53935"}}></div>Red</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#b71c1c"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#b71c1c"}}></div>Cherry</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#4caf50"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#4caf50"}}></div>Green</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#2e7d32 "})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#2e7d32 "}}></div>Forest</span>
                        </label>
                    </p>
                    
                    </div>
                    <div className="input-field col s6 m4">
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#1976d2"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#1976d2"}}></div>Blue</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#0d47a1 "})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#0d47a1 "}}></div>Royal</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#e91e63"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#e91e63"}}></div>Pink</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#ad1457"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#ad1457"}}></div>Berry</span>
                        </label>
                    </p>
                    </div>
                    <div className="input-field col s6 m4 last-color-radio">
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#9c27b0"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#9c27b0"}}></div>Purple</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#6a1b9a "})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#6a1b9a "}}></div>Violet</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#ff9800"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#ff9800"}}></div>Orange</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#ff6f00"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#ff6f00"}}></div>Soda</span>
                        </label>
                    </p>
                    </div>
                    </div>
                    <button type="submit">CREATE</button><br/>
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={()=>{this.setState({createSetForm: false})}}></div>
            </div> 
        
}
{
    //edit a unit
            this.state.editUnit && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-play-form">
            <h1>Edit Unit</h1>
            <form className="col s12" onSubmit={this.handleEditUnit}>
                <div className="row">
                    <div className="col s12">
                    <input  id="editUnitName" type="text" value={this.state.editUnitName} onChange={this.handleChange}/>
                    <label >Unit Name</label>
                    </div>
                    <div className="row">
                    <div className="input-field col s6 m4">
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#e53935"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#e53935"}}></div>Red</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#b71c1c"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#b71c1c"}}></div>Cherry</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#4caf50"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#4caf50"}}></div>Green</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#2e7d32 "})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#2e7d32 "}}></div>Forest</span>
                        </label>
                    </p>
                    
                    </div>
                    <div className="input-field col s6 m4">
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#1976d2"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#1976d2"}}></div>Blue</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#0d47a1 "})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#0d47a1 "}}></div>Royal</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#e91e63"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#e91e63"}}></div>Pink</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#ad1457"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#ad1457"}}></div>Berry</span>
                        </label>
                    </p>
                    </div>
                    <div className="input-field col s6 m4 last-color-radio">
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#9c27b0"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#9c27b0"}}></div>Purple</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#6a1b9a "})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#6a1b9a "}}></div>Violet</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#ff9800"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#ff9800"}}></div>Orange</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({unitColor: "#ff6f00"})}} name="group1" type="radio" />
                            <span className="radio-width"><div className="preview-color" style={{backgroundColor: "#ff6f00"}}></div>Soda</span>
                        </label>
                    </p>
                    </div>
                    </div>
                    <button type="submit">UPDATE</button><br/>
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={()=>{this.setState({editUnit: false})}}></div>
            </div> 
        
}
{
            this.state.deleteUnit && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-playDelete-form">
            <h1>Delete Unit?</h1>
            <p>This action is permanent</p>
            <p>Type the name of the unit to confirm</p>
            <form className="col s12 center" onSubmit={this.handleDeleteUnit}>
                <div className="row">
                    <div className="input-field col s12">
                    <input  id="unitName" type="text" onChange={this.handleChange}/>
                    <label htmlFor="title">Unit Name</label>
                    </div>
                    <button className={this.state.deleteUnitName === this.state.unitName ? (null):("btn disabled")}type="submit">Delete</button>
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={()=>{this.setState({deleteUnit: false})}}></div>
            </div> 
        }
        <h4 className="center white-text">Units</h4>
{
//show units
        this.props.sets && Object.entries(this.props.sets).splice(0).reverse().map(data=>{
            return(
                <div key={data[0]} className="set" style={{borderLeft: "5px solid "+data[1].color}}>
                   
                    <div className="set-title">
                        
                    {this.props.isOwner || this.props.isAdmin ?(<i id={data[0]} onClick={()=>{this.setState({editUnit: true, editUnitID: data[0], editUnitName: data[1].name})}} className="material-icons edit-icon">edit</i>):(null)}
                    {this.props.isOwner || this.props.isAdmin ?(<i id={data[0]} onClick={()=>{this.setState({deleteUnit: true, deleteUnitID: data[0], deleteUnitName: data[1].name})}} className="material-icons delete-icon">delete</i>):(null)}
                        
                        {data[1].name}
                        <div className="set-play-button" onClick={()=>{this.setState({openUnit: true, unitID: data[0]})}}> <i className="material-icons">play_arrow</i>PLAY</div>
                    </div>
                    
                    <div className="set-sections"> 
                        <div className="set-section">{"Questions: "+data[1].questions}</div>
                        <div className="set-section">{"Plays: "+data[1].plays}</div>
                        <div className="set-section">{"Last Edit: "+hoursAgo(new Date(data[1].lastEdit).getTime()/1000)}</div>
                        
                    </div>
                </div>
            )
        })
    }    
   {
       this.props.isOwner || this.props.isAdmin ?(
    <div className="create-set" onClick={()=>{this.setState({createSetForm: true})}}>
        + Create Unit
    </div>):(null)
   }
</div>
)
)
}} 
const mapStateToProps = (state, ownProps) =>{
    return{
        sets: state.firebase.data.play && state.firebase.data.play[ownProps.roomName],
    }
}
const mapDispatchToProps=(dispatch)=>{
    return{
        createUnit: (data)=> {dispatch(createUnit(data))},
        deleteUnit: (data)=>dispatch(deleteUnit(data)),
        editUnit: (data)=>{dispatch(editUnit(data))}, 
        updateNotificationsSeen: (data) =>{dispatch(updateNotificationsSeen(data))}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "play/"+props.roomName},
        ]
    }),
    
)(ResourcesPlay)