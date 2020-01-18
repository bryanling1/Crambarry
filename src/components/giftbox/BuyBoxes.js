import React, {Component} from "react"
import Spritesheet from 'react-responsive-spritesheet';

class BuyBoxes extends Component{
render(){
return(
<div className="buy-boxes">
<div className="row">
<div className="col s12 m4">
<div className="card z-depth-0 buy-1-card">
<div className="card-content center">
<span className="card-title center">1 Box</span>
<Spritesheet
    className={"box-1-image responsive-img"}
    image={"../images/unbox.png"}
    widthFrame={224}
    heightFrame={224}
    steps={5}
    fps={5}
    autoplay={true}
    loop={true}
    />
{this.props.noBuyOneGift}
</div>
</div>
</div>
<div className="col s12 m4">
<div className="card z-depth-0 buy-5-card">
<div className="card-content center">
<span className="card-title center">5 Boxes</span>
<Spritesheet
    className={"box-1-image responsive-img"}
    image={"../images/unbox5.png"}
    widthFrame={224}
    heightFrame={224}
    steps={5}
    fps={5}
    autoplay={true}
    loop={true}
    />
{this.props.noBuyFiveGift}
</div>
</div>
</div>
<div className="col s12 m4">
<div className="card z-depth-0 buy-15-card">
<div className="card-content center">
<span className="card-title center">15 Boxes</span>
<Spritesheet
    className={"box-1-image responsive-img"}
    image={"../images/unbox15.png"}
    widthFrame={224}
    heightFrame={224}
    steps={5}
    fps={5}
    autoplay={true}
    loop={true}
    />
{this.props.noBuy15Gift}
</div>
</div>
</div>

</div>
</div>
)
}
}export default BuyBoxes