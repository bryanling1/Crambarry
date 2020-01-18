import React, {Component} from "react"
import {connect} from "react-redux"
import {compose} from "redux"
import {signUp} from "../../store/actions/authActions"


class FinishSetup extends Component{
    handleChange = (e) =>{
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.signup(this.state)
    }
    render(){

        return(
            <div className="finish-setup">
            <div className="container">
            <div className="row">
                    <h4 className="center">Account Details</h4>
                    <h5 className="center">Finish Setting up Your Account</h5>
                    <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
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
                        <div className="input-field">
                            <label htmlFor="lobbyCode">Lobby Code (Optional)</label>
                            <input type="text" id="lobbyCode" onChange={this.handleChange}/>
                        </div>
                        <button type="submit" className="btn red accent-4">Create Account</button>
                        <p className="red-text">{}</p>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        )
    }
}
const mapDispatchToProps=(dispatch)=>{
    return{
        signup: (data)=>{dispatch(signUp(data))}
    }
}
export default compose(
    connect(null, mapDispatchToProps),
    )(FinishSetup);