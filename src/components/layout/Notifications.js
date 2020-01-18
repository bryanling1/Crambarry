import React, {Component} from "react"
import {connect} from "react-redux"
import {compose} from "redux"
import {addItem, buyGiftbox} from "../../store/actions/giftBoxActions"
//import {Redirect} from "react-router-dom";
import {firebaseConnect} from "react-redux-firebase"
import {hoursAgo} from "../class/Resources"
import {updateNotificationsSeenUser} from "../../store/actions/dashboardActions"
class Notifications extends Component{
componentDidUpdate(){
    if(this.props.user.notifications !== this.props.user.notificationsSeent ){
        this.props.updateNotificationsSeenUser({userID: this.props.auth, totalNotifications: this.props.user.notifications})
    }
}

render(){
return(
<div className="container">
    <div className="row">
    <h4 className="center">Notifications</h4>
    <div className="col s12">
    {
        this.props.notifications && Object.entries(this.props.notifications).splice(0).reverse().map(data=>{
            return (
                <a key={data}  className="notification-anchor"href={"/lobby/"+data[1].lobby+"/"+data[1].type}>
                <div className="notification-wrapper">
                    <div className="notification-top">
                        {
                            data[1].type==="profile" &&
                            <p className="notification-type">
                                <i className="material-icons">account_box</i>Account
                            </p>   
                        }
                        {
                            data[1].type==="link" &&
                            <p className="notification-type blue-text">
                                <i className="material-icons">link</i>{data[1].lobby}
                            </p>   
                           
                        }
                        {
                            data[1].type==="question" &&
                            <p className="notification-type amber-text text-darken-1">
                                <i className="material-icons">question_answer</i>{data[1].lobby}
                            </p>   
                        }
                        {
                            data[1].type==="play" &&
                            <p className="notification-type light-green-text text-accent-4">
                                <i className="material-icons">play_circle_outline</i>{data[1].lobby}
                            </p>   
                        }
                        {
                            data[1].type==="admin" &&
                            <p className="notification-type red-text text-darken-2">
                                <i className="material-icons">assignment_ind</i>{data[1].lobby}
                            </p>   
                        }
                        <p className="notification-time">
                                {hoursAgo(new Date(data[1].date)/1000)}
                        </p>
                    </div>
                        <h1>
                                { data[1].title}
                        </h1>
                        <h2>
                                { data[1].description}
                        </h2>
                </div>
                </a>
            )
        })
    }
    </div>
    </div>
</div>
)
}
}
const mapStateToProps = (state, ownProps) =>{
    return{
        user: state.firebase.profile &&  state.firebase.profile,
        auth: state.firebase.auth.uid,
        notifications: state.firebase.data.notifications && state.firebase.data.notifications[state.firebase.auth.uid]
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        addItem: (item) => dispatch(addItem(item)),
        buyGiftbox: (n) =>  dispatch(buyGiftbox(n)),
        updateNotificationsSeenUser: (data) =>{dispatch(updateNotificationsSeenUser(data))}
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "notifications/"+props.auth, queryParams: [ 'limitToFirst=50' ] },
        ]
    }),
)( Notifications );