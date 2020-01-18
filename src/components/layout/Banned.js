import React, {Component} from "react"
class Banned extends Component{
render(){
return(
    <div className="banned center">
        <div className="container">
            <div className="row">
            <h3>You Have Been Banned from this Lobby </h3>
        <h5><b>Admin Reasoning: </b><br/><br/>{this.props.match.params.reason}</h5>
            </div>
        </div>
        
       
        
    </div>
)
}}

export default Banned;