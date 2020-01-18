import React from "react"
import Spritesheet from 'react-responsive-spritesheet';
import {level_background, exact_level} from "../class/Profile";


const ProfileData = ({profile}) => {
const usersprite = profile && profile.itemBody && <div className="user-profile-preview-wrapper"><div className="user-profile-preview-border" style={{backgroundColor: level_background(profile.xp)}}><div className="user-profile-preview">
<Spritesheet
    className={"sprite-profile sprite-body-index"}
    image={profile.itemBody && `/images/`+profile.itemBody+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-head-index"}
    image={profile.itemHead && `/images/`+profile.itemHead+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-desk-index"}
    image={profile.itemDesk && `/images/`+profile.itemDesk+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-hat-index"}
    image={profile.itemHat &&`/images/`+profile.itemHat+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-face-index"}
    image={`/images/`+profile.itemFace+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>
<Spritesheet
    className={"sprite-profile sprite-legs-index"}
    image={"/images/"+profile.itemLegs+".png"}
    widthFrame={64}
    heightFrame={64}
    steps={10}
    fps={10}
    autoplay={true}
    loop={true}
/>

</div>
<div className="sprite-user-level" style={profile.xp && {backgroundColor: level_background(parseInt(profile.xp))}}>{profile.xp && exact_level(profile.xp)}</div></div></div>
const userspritename = profile && 
<div className="user-profile-name-wrapper">
<div className="user-profile-name">
<div className="user-profile-name-username">
{profile.username} 
</div>
<div className="user-profile-name-actualname">
{profile.firstName + " " + profile.lastName}
</div>
</div>
</div>

return(
<div className="profile-data">
    <div className="profile-wrapper">
    {usersprite}
    {userspritename}
    </div>
   

</div>
)
}
export default ProfileData