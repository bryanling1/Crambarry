import React, {Component} from "react"
import Circle from 'react-circle';
import Spritesheet from 'react-responsive-spritesheet';
import {Link} from "react-router-dom"
import {level_background, early_levels, xp_subtract, exact_level } from "../class/Profile";
import LobbyNotifications from "./LobbyNotifications"
class LobbyOwnProfile extends Component{
state={
    timer:0,
    notifications: false
}
componentDidMount() {
    this.setState({timer: 0});
    this.interval = setInterval(() => {
    this.setState({timer: this.state.timer === 45?(this.updateXp(this.state.timer, this.props.props.user.xp), this.state.timer - 45):(this.state.timer + 1) });
    }, 1000);
    }
componentWillUnmount(){
    clearInterval(this.interval);
 }
 

updateXp = (num, xp) =>{
if(num === 45 && this.props.props.users[this.props.props.auth].status === "online"){
    this.props.props.updateXp({number: 7, uid: this.props.props.auth, lobby:this.props.props.match.params.id })
    if(exact_level(xp) !== exact_level(xp+7)){
        this.props.props.givePresent({uid: this.props.props.auth});
    }
}
}

render(){
let x= this.props.props.user.xp && this.props.props.user.xp;
let levelProgress = (x-xp_subtract(x))%early_levels(x);
let levelProgressBar = Math.floor( levelProgress / early_levels(x) * 100);
let level = exact_level(x);
if (x){
    document.title = "LVL"+level + "(" + levelProgress +"/"+early_levels(x)+")"
}
return(
<div className="row" style={{marginTop: "7px", marginBottom:"16px", position: "relative"}}>
<div className="col s1"></div>
<div className="col s3 m4">
<div className="left-icons">
<div className="user-level-chat" style={{backgroundColor: level_background(x)}}>LVL {level}</div>
<div className="progress-20mins" >
<span className="progress-time white-text" >{45-this.state.timer}</span>
<div className="progress-circle" >
    <Circle
    animate={true}
    animationDuration="0.7s"
    progress={this.state.timer/(45) * 100}
    size={0}
    lineWidth={40} 
    responsive={true}
    showPercentage={false}
    progressColor={level_background(x)}
    />
</div>
<p className="white-text">+7xp</p>
</div>
</div>
</div>
<div className="col s6">
    <div className={"progress yellow lighten-4"}><span className="progress-amount">{levelProgress+"/"+early_levels(x)}</span>
    <div className="determinate amber lighten-2" style={{ width : levelProgressBar+"%", zIndex: 80, position: "absolute"}}></div>
    </div>
</div>

<div className="col s2" style={{position: "relative"}}>
    <Link to="/gifts">
    <div className="presents">
    <Spritesheet
    className={"present-box"}
    image={"/images/unbox.png"}
    widthFrame={224}
    heightFrame={224}
    steps={5}
    fps={5}
    autoplay={true}
    loop={true}
    />
    <div className="small-red-gift-number-icon">{this.props.props.user.presents}</div></div>
    </Link>
    <div className="notifications-own-profile" onClick={()=>{this.setState({notifications: !this.state.notifications})}}>
        
            {
                this.props.props.user.notifications &&
                this.props.props.user.notificationsSeen &&
                this.props.props.user.notifications !== null &&
                this.props.props.user.notificationsSeen !== null && 
                this.props.props.user.notifications !== this.props.props.user.notificationsSeen ? (
                    <div className="small-red-gift-number-icon">
                        {this.props.props.user.notifications - this.props.props.user.notificationsSeen }
                    </div>
                ):(null)

            }
        <i className="material-icons" >notifications</i>
        { this.state.notifications && 
        <i className="material-icons small-notifications-arrow">arrow_drop_up</i>
        }
    </div>
</div>
    
        {
            this.state.notifications && 
            <LobbyNotifications/>
        }
</div>

)
}
}
export default LobbyOwnProfile;
