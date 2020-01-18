import React, {Component} from "react"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"

class Test extends Component{
handleAdd = (e) =>{
    e.preventDefault()
    this.props.sendTest();
}
render(){
console.log(this.props)

return(
    <div className="text center">
    <button onClick={this.handleAdd}>Add</button>
    </div>
)

}
}

const mapStateToProps = (state, ownProps) =>{
    return{
        chat: state.firebase.data.Lobbies
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "/Lobbies", queryParams: [ 'limitToFirst=1' ]}
        ]
    })
)(Test);