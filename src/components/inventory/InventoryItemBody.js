import React, {Component} from "react";
import Spritesheet from 'react-responsive-spritesheet';
import {connect} from "react-redux";
import {compose} from "redux";
import {setItemBody} from "../../store/actions/inventoryActions"
import {itemsBody} from "../class/Items"

class InventoryItemBody extends Component {
state={
    itemName: null,
    uid: this.props.auth
}
handleHover=(e)=>{
    this.setState({
        ...this.state,
        itemName: e.target.id
    })
}
handleSwitchItem=(e)=>{
    if(this.state.itemName){
        this.props.selectItem(this.state);
    }
}
handleMouseOut=(e)=>{
    this.setState({
        itemName: this.props.userCurrent.itemBody
    })
}

render(){
const {userCurrent} = this.props
const items = itemsBody
const foundItemsList = this.props.foundItems && this.props.foundItems
const firstitem = userCurrent.itemBody?(userCurrent.itemBody) :("whitehoodie-body-idle");


return(
<div className="card inventory-card z-depth-1 card-border">
<div className="card-content ">
<span className="card-title">Body</span>
<div className="card-inventory-wrapper">
<Spritesheet
    className={"sprite-inventory"}
    image={
        this.state.itemName?("../images/"+this.state.itemName+".png"):("../images/"+firstitem+".png")
        }
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<div className="item-list">
<ul className="collection">
{
//unlocked items
items && foundItemsList && items.map(item=>{
let itemArray = item.name.split("-")
let itemName = itemArray[0]
let itemPart = itemArray[1]
if (itemPart === "body" && foundItemsList.includes(item.name)){
    let selectIcon = item.name === userCurrent.itemBody?(<div className="selected-inventory-item"></div>):
    (<div id={item.name} onClick={this.handleSwitchItem}className="equip-inventory-item btn" >EQUIP</div>)
    return (
    <li id={item.name}  onMouseEnter={this.handleHover} onMouseLeave={this.handleMouseOut}key={itemName}className={"collection-item item-tier-"+item.tier}>{itemName}{selectIcon}</li>
)
}else{
    return null;
}
})}
{
//locked items
items && foundItemsList && items.map(item=>{
let itemArray = item.name.split("-")
let itemName = itemArray[0]
let itemPart = itemArray[1]
if (itemPart === "body" && !foundItemsList.includes(item.name)){
    return (
    <li id={item.name} onMouseEnter={this.handleHover} onMouseLeave={this.handleMouseOut} key={itemName}className={"collection-item item-locked item-tier-"+item.tier}>{itemName}<div className="item-locked-icon"></div></li>
)
}else{
    return null;
}

})

}
</ul>
</div>
</div>
</div>
</div>

)
}
}

const mapDispatchToProps = (dispatch) =>{
    return{
        selectItem: (data) => dispatch(setItemBody(data))
    }
}
export default compose(
    connect(null,  mapDispatchToProps),
)(InventoryItemBody);