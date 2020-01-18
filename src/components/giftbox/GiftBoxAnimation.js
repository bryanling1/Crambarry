import React, {Component} from "react"
import Spritesheet from "react-responsive-spritesheet"
import {Link} from "react-router-dom"

class GiftBoxAnimation extends Component{
state={
    rouletteItems: null,
    randomColor: ["grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "grey lighten-1", "blue",  "blue",  "blue",  "blue",  "blue", "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue", "blue","blue","blue","blue","blue","blue","blue","blue","blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "blue",  "purple",  "purple",  "purple",  "purple",  "purple",  "purple",  "purple",  "purple",  "purple",  "purple",    "yellow", "yellow", "yellow", "yellow"],
    randomIconDefault: ["head", "legs", "face", "body", "desk", "hat"]
}
componentDidMount(){
    var randomItems = [];
    for(var x=0; x<40; x++){
        randomItems.push(x);
    }
    this.setState({rouletteItems: randomItems})
}
handleClose = () =>{
    this.props.handleOpenMore();
}

render(){
const dup1 = this.props.gift1.dup && this.props.gift1.dup?(<div className="hidden-tokens"><p className="white-text">Duplicate: +{this.props.gift1.dup}</p><div className="tokens-icon tokens-right"></div></div>):(<div></div>);
return(
<div className="gift-box-animation">
<div className="opening-gift-container">
<div className="container">
<div className="row">
<br/>
<Spritesheet
    className={"box-animation-image responsive-img"}
    image={"../images/unbox-animation.png"}
    widthFrame={224}
    heightFrame={224}
    steps={15}
    fps={6}
    autoplay={true}
    loop={false}
    />
</div>
<div className="row">
    <div className="roulette">
        <div className="roulette-shadow">

        </div>
        <div className="roulette-pointer"></div>
        <div className="roulette-card-wrapper" style={{animationName: "roulette"+Math.floor(Math.random()*5+1)}}>
        {
            this.state.rouletteItems && this.state.rouletteItems.map(data=>{
                if(data === 37){
                    return (
                    <div className="roulette-card" key={data}>
                        <div className="roulette-card-icon" style={this.props.gift1.name && {backgroundImage: "url('/images/icons/"+this.props.gift1.name.split("-")[1]+".png')"}}>

                        </div>
                        <div className={"roulette-card-color "+ this.props.gift1.color}>
                            {this.props.gift1.quality}
                        </div>    
                    </div>
                )
                }else{
                    const randomColor = this.state.randomColor[Math.floor(Math.random()*200)];
                    var rarity = "";
                    if(randomColor === "blue"){
                        rarity = "RARE";
                    }else if (randomColor === "yellow"){
                        rarity = "LEGENDARY"
                    }else if (randomColor === "purple"){
                        rarity = "EPIC"
                    }else{
                        rarity = "COMMON"
                    }
                    return (
                    <div className="roulette-card" key={data}>
                        <div className="roulette-card-icon" style={{backgroundImage: "url('/images/icons/"+this.state.randomIconDefault[Math.floor(Math.random()*this.state.randomIconDefault.length)]+".png')"}}>

                        </div>
                            <div className={"roulette-card-color "+randomColor}>
                            {rarity}
                            </div>  
                          
                    </div>
                )
                }
                
            })
            
        }
        </div>

    </div>
</div>
<div className="row">

<div className="center ">
<div className={"card gift-animation gift-1 "+this.props.gift1.color+" card-glow-"+this.props.gift1.color}>
<div className="card-content">
<span className="card-title white-text show-after-color-reveal gift-box-title">{this.props.gift1.name && this.props.gift1.name.split("-")[0].toUpperCase()}</span>

<Spritesheet
className={"sprite-gift show-after-color-reveal"}
image={this.props.gift1.name ? ("/images/"+this.props.gift1.name+".png"):("/images/none-face-idle.png")}
widthFrame={64}
heightFrame={64}
steps={10}
fps={10}
autoplay={true}
loop={true}
background={`/images/card-glow.png`}
backgroundSize={`cover`}
backgroundRepeat={`no-repeat`}
backgroundPosition={`center center`}
/>
<p className="right quality-card card-text-opacity show-after-color-reveal-tier">{this.props.gift1.quality}: {this.props.gift1.name && this.props.gift1.name.split("-")[1].toUpperCase()}</p>
</div>
</div>
<div className="duplicate center">{dup1}</div>
</div>
</div>

<div className="row center go-again-buttons">
    <button className="btn blue open-another" ><Link to="/inventory">VIEW INVENTORY</Link></button>
    <button className="btn yellow darken-2 open-another" onClick={this.handleClose}>OPEN MORE</button>
</div>
</div>

</div>
</div>   
        )
    }
}export default GiftBoxAnimation