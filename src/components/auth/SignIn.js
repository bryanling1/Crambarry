import React, {Component } from "react";
import {connect} from "react-redux";
import {signIn} from "../../store/actions/authActions"
import {Redirect} from "react-router-dom"

class Signin extends Component{
    state = {
        email: null,
        password: null
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.signIn(this.state)
    }
    componentDidMount(){
        console.log(this.props.match && this.props.match.params)
        if(this.props.match.params.direct && this.props.match.params.direct === "direct" && !this.props.auth.uid){
            this.props.signIn(this.state)
        }
    }
    render(){
        
        const {auth} = this.props;
        if(auth.uid) return < Redirect to={"/profile/"+auth.uid}/>
        return(
            this.props.match.params.direct && this.props.match.params.direct === "direct" ? (null) :(
            <div className="sign-in-new">
            <div className="container">
                <div className="row">
                    <img alt="in" className="in" src="/images/profile/in.png" width="300px"/>
                    <img onClick={this.handleSubmit} className="google-button"alt="google-signin" width="300px" src="/images/btn_google_signin_light_normal_web@2x.png"/>
                </div>
            </div>
            </div>)
        )
    }
}
const mapStateToProps = (state) =>{
    return{
        loginFail: state.auth.authFail,
        auth: state.firebase.auth
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        signIn : (creds) => dispatch(signIn(creds))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signin)