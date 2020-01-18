import React, {Component} from "react"
import {connect} from "react-redux"
import {compose} from "redux"
import {addItem, buyGiftbox} from "../../store/actions/giftBoxActions"
import firebase from "firebase/app"
import GiftBoxAnimation from "./GiftBoxAnimation"
import Spritesheet from 'react-responsive-spritesheet';
import BuyBoxes from "./BuyBoxes";
import {Redirect} from "react-router-dom";
class RootGiftBox extends Component{
state = {
    giftContainer: false,
    gift1: null,
    gift1name: null,
    gift1color: null,
    gift1dup: null,
    gift1dupbool: null,
    boxType: "default",
    defaultTier1Items: 38,
    defaultTier2Items: 29,
    defaultTier3Items: 19,
    defaultTier4Items: 8
}
transferGift = (thing) =>{
  return thing;
}
buyBoxes = (boxes, price) =>{
  this.props.buyGiftbox({boxes: boxes, price: price});
}

handleClose = () =>{
    this.setState({
        giftContainer: false
    })
}
generateItems = (e) =>{
//this.props.removePresent();
//each tier has its own id, so to prevent finding duplicates, each tier needs and empty array
let foundItemsT1 = [];
let foundItemsT2 = [];
let foundItemsT3 = [];
let foundItemsT4 = [];
var i = 1;
   let x = Math.floor(Math.random()*200)
    let tier = null;
    let color = null;
    let item = null;
    let quality = null;
    let dup = null;
    let stateName = "gift" + i + "color";
    let itemStateName = "gift" + i ;
    let itemQuality = "gift" + i+"quality";
    let itemDup = "gift" + i+"dup";
    if (x>140&&x<=185){
        //get random number to select from 
       //make sure it hasnt been generated yet
       let rando = 0;
       do {
         rando = Math.floor(Math.random()*(this.state[this.state.boxType+"Tier2Items"])) + 1;
       }while(foundItemsT2.includes(rando))
       foundItemsT2.push(rando)
       item = rando
        color = "blue";
        quality = "RARE";
        tier = 2;
        dup = 15;
      }
      
    else if(x>185&&x<=197){
        //get random number to select from 
       //make sure it hasnt been generated yet
      let rando = 0;
      do {
        rando = Math.floor(Math.random()*(this.state[this.state.boxType+"Tier3Items"])) + 1;
      }while(foundItemsT3.includes(rando))
      foundItemsT3.push(rando)
      item = rando
          color = "purple";
          quality = "EPIC";
          tier = 3;
          dup = 25;
      
    }else if (x>197){
        //get random number to select from 
       //make sure it hasnt been generated yet
        let rando = 0;
        do {
          rando = Math.floor(Math.random()*(this.state[this.state.boxType+"Tier4Items"])) + 1;
        }while(foundItemsT4.includes(rando))
        foundItemsT4.push(rando)
        item = rando
        color = "yellow";
        quality = "LEGENDARY";
        tier = 4;
        dup = 50;
    }else{
       //get random number to select from 
       //make sure it hasnt been generated yet
      let rando = 0;
      do {
        rando = Math.floor(Math.random()*(this.state[this.state.boxType+"Tier1Items"])) + 1;
      }while(foundItemsT1.includes(rando))
      foundItemsT1.push(rando)
      item = rando
      color = "grey lighten-1";
      quality = "COMMON";
      tier = 1;
      dup = 5;
    }
    
    //Check to see if it is duplicate, before adding item to the database
    let itemTier = "gift" + i+"tier";
    //add the item to the database
    //this.props.addItem({name: item.name, tier : tier});
    let obj = {}
    let objItem = {}
    let objQuality = {}
    let objDub = {}
    let objtier = {}
    obj[stateName] = color
    objItem[itemStateName] = item
    objQuality[itemQuality] = quality
    objDub[itemDup] = dup
    objtier[itemTier] = tier
    this.setState(obj)
    this.setState(objItem)
    this.setState(objQuality)
    this.setState(objDub)
    this.setState(objtier)
}
getItems=()=>{
  firebase.database().ref("/items/"+this.state.boxType+"/ItemsTier"+this.state.gift1tier+"/"+this.state.gift1+"/name").once("value").then(data=>{
    //see if the user has the item
    firebase.database().ref("/userItems/"+this.props.auth+"/"+data.val()).once("value").then(data2=>{
      let dupbool = data2.val()?(true):(false);
      this.setState({
        gift1dupbool: dupbool,
        gift1name: data.val()
      })
      this.props.addItem({name:data.val(), tier:this.state.gift1tier, isDup: dupbool});
    })
  })
  this.setState({
    gift1: null
  })
}

openBox=()=>{
  this.generateItems();
}

componentDidMount(){  
    document.title = "Gifts";
    if(this.props.auth) {
      var x = document.getElementById("loader");
      x.style.display = "none";
    }
}
componentDidUpdate(){
  this.state.gift1 && this.getItems();
  this.state.gift1 && this.setState({
    giftContainer: true
  })
}
render(){
if(!this.props.auth) {return <Redirect to="/login"/>}
const gift1dup = this.state.gift1dup && this.state.gift1dupbool?(this.state.gift1dup):(null);
const gift2dup = this.state.gift2dup && this.state.gift2dupbool?(this.state.gift2dup):(null);
const gift3dup = this.state.gift3dup && this.state.gift3dupbool?(this.state.gift3dup):(null);
let display = this.state.giftContainer && this.state.giftContainer === true ?
 (<GiftBoxAnimation gift1={{name:this.state.gift1name, color: this.state.gift1color, quality: this.state.gift1quality, dup:gift1dup}} 
 gift2={{name:this.state.gift2name, color: this.state.gift2color, quality: this.state.gift2quality, dup:gift2dup}} 
 gift3={{name:this.state.gift3name, color: this.state.gift3color, quality: this.state.gift3quality, dup:gift3dup}}handleOpenMore={this.handleClose}/>):(null);

 const {user} = this.props;

const noPresents = user.presents > 0?(<button className={"btn-large amber lighten-1 pulse open-gift-box-main"} onClick={this.openBox}>OPEN GIFT BOX ({user.presents})</button>):(<button className={"btn-large  disabled open-gift-box-main"}>OPEN GIFT BOX ({user.presents})</button>);
const noBuyOneGift = user.tokens >= 120?(<button className="btn amber lighten-1 z-depth-1 waves-effect waves-light" onClick={()=>this.buyBoxes(1, 120)}>Buy: 120</button>):(<button className="btn z-depth-1 disabled" >Buy: 120</button>)
const noBuyFiveGift = user.tokens >= 480?(<button className="btn amber lighten-1 z-depth-1 waves-effect waves-light" onClick={()=>this.buyBoxes(5, 480)}>Buy: 480</button>):(<button className="btn z-depth-1 disabled" >Buy: 480</button>)
const noBuy15Gift = user.tokens >= 1250?(<button className="btn amber lighten-1 z-depth-1 waves-effect waves-light" onClick={()=>this.buyBoxes(15, 1250)}>Buy: 1250</button>):(<button className="btn z-depth-1 disabled" >Buy: 1250</button>)
return(
<div className="root-gift-box">
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
<div className="center">
<br/><br/><br/>
<div className="center">
<Spritesheet
    className={"open-gift-box responsive-img"}
    image={"../images/unbox.png"}
    widthFrame={224}
    heightFrame={224}
    steps={5}
    fps={5}
    autoplay={true}
    loop={true}
    />
    </div>
{noPresents}
{/*<div className="container"><div className="row center"><div className="col s12 m4"></div><div className="col s12 m4">
<div className="card z-depth-0 dups-explain">
<div className="card-content">
<span className="card-title dubs-explain-title">DUPLICATES</span>
<table>
<tr>
<td>Legendary</td><td>+50</td>
</tr>
<tr>
<td>Epic</td><td>+25</td>
</tr>
<tr>
<td>Rare</td><td>+15</td>
</tr>
<tr>
<td>Common</td><td>+5</td>
</tr>
</table>
</div>
</div>
</div><div className="col s12 m4"></div></div></div>*/}

</div>
{display}
<div className="container">
<br/><br/>
<div className="row">
<div className="col s3"><div className="tokens-count"><div className="tokens-icon"></div>{this.props.user.tokens}</div></div>
</div>

<BuyBoxes buyBoxes={this.buyBoxes} noBuyOneGift={noBuyOneGift} noBuyFiveGift={noBuyFiveGift} noBuy15Gift={noBuy15Gift}/>
</div>


</div>
)
}
}
const mapStateToProps = (state, ownProps) =>{
    return{
        auth: state.firebase.auth.uid,
        user: state.firebase.profile,
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        addItem: (item) => dispatch(addItem(item)),
        buyGiftbox: (n) =>  dispatch(buyGiftbox(n))
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)( RootGiftBox );