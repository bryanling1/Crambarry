import React, {Component} from "react"
import Spritesheet from 'react-responsive-spritesheet';
import {level_background, exact_level} from "../class/Profile";
import {Link} from "react-router-dom"

class LobbyInteract extends Component{
render(){
return(
<div className="lobby-interact">
{
//online
this.props.users && Object.values(this.props.users).map((user, index)=>{
if(/*user.status === "online" && */ this.props.lobbyData && user.id === this.props.auth &&!this.props.lobbyData.bannedUsers[user.id]) {
return (
<Link key={index} to={"/profile/"+user.id} >
<div className="lobby-character" >
<div className="lobby-character-hover" style={{backgroundColor:level_background(user.xp)}}></div>
<div className="sprite-username white-text">{user.username}</div>
<div className="white-text user-small-level lighten-2" style={{backgroundColor: level_background(user.xp)}}>{exact_level(user.xp)}</div>
<Spritesheet
className={"sprite sprite-body-index"}
image={`/images/`+user.itemBody+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-head-index"}
image={`/images/`+user.itemHead+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-desk-index"}
image={`/images/`+user.itemDesk+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-hat-index"}
image={`/images/`+user.itemHat+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-face-index"}
image={`/images/`+user.itemFace+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-legs-index"}
image={"/images/"+user.itemLegs+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
</div>
</Link>
)}else{
    return <div key={index} className="hide"></div>
}
})
}
{
//everyone
this.props.users && Object.values(this.props.users).map((user, index)=>{
if(user.status === "online" &&  this.props.lobbyData && user.id !== this.props.auth &&!this.props.lobbyData.bannedUsers[user.id]) {
return (
<Link key={index} to={"/profile/"+user.id} >
<div className="lobby-character" >
<div className="lobby-character-hover" style={{backgroundColor:level_background(user.xp)}}></div>
<div className="sprite-username white-text">{user.username}</div>
<div className="white-text user-small-level lighten-2" style={{backgroundColor: level_background(user.xp)}}>{exact_level(user.xp)}</div>
<Spritesheet
className={"sprite sprite-body-index"}
image={`/images/`+user.itemBody+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-head-index"}
image={`/images/`+user.itemHead+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-desk-index"}
image={`/images/`+user.itemDesk+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-hat-index"}
image={`/images/`+user.itemHat+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-face-index"}
image={`/images/`+user.itemFace+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-legs-index"}
image={"/images/"+user.itemLegs+".png"}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
/>
</div>
</Link>
)}else{
    return <div key={index} className="hide"></div>
}
})
}
{
//offline

this.props.users && Object.values(this.props.users).map((user, index)=>{
if(user.status !== "online" && !this.props.lobbyData.bannedUsers[user.id]) {
    
return (
<Link key={index} to={"/profile/"+user.id} >
<div className="lobby-character sprite-offline" >
<div className="lobby-character-hover" style={{backgroundColor:level_background(user.xp)}}></div>
<div className="sprite-username white-text">{user.username}</div>
<div className="white-text user-small-level lighten-2" style={{backgroundColor: level_background(user.xp)}}>{exact_level(user.xp)}</div>
<Spritesheet
className={"sprite sprite-body-index"}
image={`/images/`+user.itemBody+".png"}
widthFrame={64}
heightFrame={64}
steps={1}
fps={1}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-head-index"}
image={`/images/`+user.itemHead+".png"}
widthFrame={64}
heightFrame={64}
steps={1}
fps={1}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-desk-index"}
image={`/images/`+user.itemDesk+".png"}
widthFrame={64}
heightFrame={64}
steps={1}
fps={1}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-hat-index"}
image={`/images/`+user.itemHat+".png"}
widthFrame={64}
heightFrame={64}
steps={1}
fps={1}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-face-index"}
image={`/images/`+user.itemFace+".png"}
widthFrame={64}
heightFrame={64}
steps={1}
fps={1}
autoplay={true}
loop={true}
/>
<Spritesheet
className={"sprite sprite-legs-index"}
image={"/images/"+user.itemLegs+".png"}
widthFrame={64}
heightFrame={64}
steps={1}
fps={1}
autoplay={true}
loop={true}
/>
</div>
</Link>
)}else{
    return <div key={index} className="hide"></div>
}
})
}
</div>
)
}
} 

export default LobbyInteract