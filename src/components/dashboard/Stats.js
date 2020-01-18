import React from "react";
import moment from 'moment';
const Stats = ({profile}) =>{
const date = profile &&  moment.unix(profile.dateJoined).format("MMMM Do YYYY");
return(
<div className="stats">
<div className="container">
<div className="row">
    <div className="col s12 m4 center">
        <h1 className="user-stats-title">ITEMS COLLECTED</h1>
        <p className="user-stats-number">{profile && profile.items +"/95"}</p>
    </div>
    <div className="col s12 m4 center">
        <h1 className="user-stats-title">DATE JOINED</h1>
        <p className="user-stats-date">{date}</p>
    </div>
</div>
</div>
</div>
)
}
export default Stats