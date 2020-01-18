import React, {Component} from "react"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"
import {Redirect} from "react-router-dom"
//import firebase from "firebase/app"


class Count extends Component{
state={
    tier4: null,
    users: null
}

render(){

if(!this.props.auth || this.props.auth !== "kUJQ6VkWnydqoUZfHIp4lAf6uuG2") {return <Redirect to="/login"/>}
const accountsDisplay = this.props.users && Object.values(this.props.users).length
return(

<div className="Count">
<br></br>
<div className="container">
    <div className="row">
        <div className="col s12 m3">
        <p style={{lineHeight: "12px", margin: "0px", textAlign: "center"}}>Accounts Created</p>
        <h1 style={{fontSize: "30px", lineHeight: "35px", margin: "0px", textAlign: "center"}}>{accountsDisplay}</h1>
        </div>
        <div className="col s12 m3">
        <p style={{lineHeight: "12px", margin: "0px", textAlign: "center"}}>BOXES OPENED</p>
        <h1 style={{fontSize: "30px", lineHeight: "35px", margin: "0px", textAlign: "center"}}>{this.props.admin && this.props.admin.boxesOpened}</h1>
        </div>
        <div className="col s12 m3">
        <p style={{lineHeight: "12px", margin: "0px", textAlign: "center"}}>LEGENDARIES FOUND</p>
        <h1 style={{fontSize: "30px", lineHeight: "35px", margin: "0px", textAlign: "center"}}>{this.props.admin && this.props.admin.itemsFoundT4}</h1>
        </div>
        <div className="col s12 m3">
        <p style={{lineHeight: "12px", margin: "0px", textAlign: "center"}}>XP EARNED</p>
        <h1 style={{fontSize: "30px", lineHeight: "35px", margin: "0px", textAlign: "center"}}>{this.props.admin && this.props.admin.totalxp}</h1>
        </div>
    <br/><br/>
        <div className="row center">
            <h5>Users</h5>
        <table className="striped">
        <thead>
          <tr>
              <th>Name</th>
              <th>Username</th>
          </tr>
        </thead>

        <tbody>
         
            {
                this.props.users && this.props.users.slice(0).reverse().map(data=>{
                    return(
                        <tr key={data.key}>
                    <td>{data.value.firstName + " " +data.value.lastName}</td>
                    <td>{data.value.username}</td>
                </tr>
                    )
                
                })
            }
         
        </tbody>
      </table>
        </div>
    </div>
</div>

</div>
)

}
}

const mapStateToProps = (state, ownProps) =>{
    console.log(state)
    return{
        users: state.firebase.ordered.users,
        admin: state.firebase.data.admin,
        auth: state.firebase.auth.uid
    }
}

export default compose(
    connect(mapStateToProps),
    firebaseConnect((props)=>{
        return[{path: "users", queryParams: [ 'orderByChild=dateJoined' ]},
                {path: "admin"}]
    })
)(Count);