import React, {Component} from "react"
import firebase from "firebase/app"

class LobbyData extends Component{
state = {
    image: null
}
componentDidMount(){
    firebase
.database()
.ref("lobbyData/"+this.props.lobby)
.once("value")
.then(doc=>{
        this.setState({image: doc.val().image});
      });
}
render(){

return (
    <img alt={this.props.lobby} width="100%"src={this.state.image && "/images/backgrounds/"+this.state.image}/>
)
}}

export default LobbyData;