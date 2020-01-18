import React, {Component } from "react";
import {connect} from "react-redux";
import {signUp} from "../../store/actions/authActions"
import {Redirect} from "react-router-dom"

class Signup extends Component{
    state={
        email: null,
        password: null,
        firstName: null,
        lastName: null,
        username: null,
    }
    handleChange = (e) =>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.signUp(this.state);
    }
    render(){
        const {signUpError, auth} = this.props;
        const signUpErrorMessage = signUpError ? (signUpError) : (null)
        if(auth) return(<Redirect to={"/profile/"+auth}/>)
        return(
            <div className="sign-in container">
                <div className="row">
                    <h4 className="center">Signup</h4>
                    <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
                        <div className="input-field">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" onChange={this.handleChange} required/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password"  onChange={this.handleChange} required/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" onChange={this.handleChange} required/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" onChange={this.handleChange} required/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" onChange={this.handleChange} required/>
                        </div>
                        <button type="submit" className="btn red accent-4">Create Account</button>
                        <p className="red-text">{signUpErrorMessage}</p>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return{
        signUpError: state.auth.authFail,
        auth: state.firebase.auth.uid
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        signUp: (data) => dispatch(signUp(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Signup)