import React, {Component} from "react"
import {connect} from "react-redux"
import {Redirect} from "react-router-dom"
import {compose} from "redux"
import MyRooms from "./MyRooms"
import ProfileData from "./ProfileData"
import Stats from "./Stats.js"
import firebase from "firebase/app"
import FinishSetup from "./FinishSetup"
import FirstTime from "./FirstTime"


class RootDashboard extends Component{
    state={
        firstTime: true
    }
    componentDidMount(){
        document.title = "Profile";
        this.props.match.params.id && 
        firebase
        .database()
        .ref("users/"+this.props.match.params.id)
        .on("value", run=>{
           this.setState(run.val())
        })
    }
    render(){
        if(!this.props.auth) return <Redirect to="/login"/>
        const isOwnProfile = this.props.match.params.id === this.props.auth;

        return(
            <div>
                {
                    //first time 
                    this.state.firstTime && 
                    <FirstTime close={()=>{this.setState({firstTime: false})}}/>
                    
                }
                {
            this.props.profile.isLoaded && this.props.profile.isEmpty === false && this.props.profile.firstName && this.props.profile.items?(
            <div className="my-rooms">
                <ProfileData profile={this.state}/>
                {
                    //<Stats profile={this.state} />
                } 
                <br/>
                <div id="room">
                <MyRooms id={this.props.match.params.id} isOwnProfile={isOwnProfile}/>
                </div>
            </div>):(null)
                }
                {
                    this.props.profile.isLoaded && this.props.profile.firstName === undefined && 
                    < FinishSetup />
                }
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    
    return{
        auth: state.firebase.auth.uid,
        profile: state.firebase.profile
    }
}

export default compose(
    connect(mapStateToProps),
    )(RootDashboard);