import React, {Component} from "react";
import InventoryItemBody from "./InventoryItemBody"
import InventoryItemLegs from "./InventoryItemLegs"
import InventoryItemDesk from "./InventoryItemDesk"
import InventoryItemHead from "./InventoryItemHead"
import InventoryItemHat from "./InventoryItemHat"
import InventoryItemFace from "./InventoryItemFace"
import {connect} from "react-redux";
import {compose} from "redux";
import {Redirect} from "react-router-dom";
import firebase from "firebase/app"


class RootInventory extends Component {
state = {
  items: null,
  load: false
}

didLoad = () =>{
    document.title = "Inventory";
    var x = document.getElementById("loader");
    x.style.display = "none";
}
componentDidMount(){
  firebase.database().ref("userItems/"+this.props.auth).once("value").then(data=>{
    var items = Object.keys(data.val()).map(data=>{
      return data;
    })
    this.setState({items: items});
  })
}

render(){
if(!this.props.auth) {return <Redirect to="/login"/>}
const {userCurrent} = this.props;
const completion = userCurrent.items && userCurrent.items+ "/95";
userCurrent.items && !this.state.load && this.setState({
  load:true
})

return(
<div className="root-inventory" >
{
this.state.load?(null):(
  <div className="center" id="loader">
<br/><br/><br/>
<div className="preloader-wrapper big active ">
    <div className="spinner-layer spinner-blue-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
  </div>
</div>
)
}
<div className="container">
<h4 className="center">Inventory ({completion})</h4>
<div className="row">
<div className="col s12 m4">
    <InventoryItemHead auth={this.props.auth} foundItems={this.state.items} userCurrent={this.props.userCurrent} items={this.props.items}/>
</div>   
<div className="col s12 m4">
    <InventoryItemHat auth={this.props.auth} foundItems={this.state.items} userCurrent={this.props.userCurrent} items={this.props.items}/>
</div>  
<div className="col s12 m4">
    <InventoryItemFace auth={this.props.auth} foundItems={this.state.items} userCurrent={this.props.userCurrent} items={this.props.items}/>
</div>  
</div>
<div className="row">
<div className="col s12 m4">
    <InventoryItemBody auth={this.props.auth} foundItems={this.state.items} userCurrent={this.props.userCurrent} items={this.props.items} didLoad={this.didLoad}/>
</div>
<div className="col s12 m4">
    <InventoryItemLegs auth={this.props.auth} foundItems={this.state.items} userCurrent={this.props.userCurrent} items={this.props.items}/>
</div>
<div className="col s12 m4">
    <InventoryItemDesk auth={this.props.auth} foundItems={this.state.items} userCurrent={this.props.userCurrent} items={this.props.items}/>
</div>
</div>
</div>
</div>

)
} 
}
const mapStateToProps = (state, props)=>{
    return{
        auth: state.firebase.auth.uid,
        userCurrent: state.firebase.profile
    }
}
export default compose(
connect(mapStateToProps),
)(RootInventory);