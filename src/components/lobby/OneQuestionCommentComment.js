import React, {Component} from "react"
import firebase from "firebase/app"
import {addQCommentComment} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import {hoursAgo} from "../class/Resources"

class OneQuestionCommentComment extends Component{
state={
   commentform: false
}
handleSubmit = (e) =>{
    e.preventDefault()
    if(this.state.comment){
        this.props.addLink({id: this.props.commentid,  comment: this.state.comment, lobby: this.props.lobby, questionid: this.props.questionid, authorid: this.props.authorid, questionTitle: this.props.questionTitle })
        this.setState({linksform: false, seconds: null, toomany: null, comment: null, commentform: false})
        this.getLinks();
            
    }
}
handleChange = (e) =>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
//gets the links and sets the state as an object 
getLinks = () =>{
    firebase.firestore().collection("questionCommentComments/"+this.props.commentid+"/comments").orderBy("date").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
componentDidMount(){
    this.getLinks();
    console.log(this.props)
}
render(){
return(
<div className="comment-comment">
    {
        this.state.links && this.state.links.map(data=>{
            return(
                <div className="comment-comment-row" key={data.date}>
                    <span>{data.name+":" }</span> {data.comment}
                    <span className="commentcomment-time-color"><i className="material-icons resources-commentcomment-time">access_time</i>{hoursAgo(data.date.seconds)}</span>
                </div>
            )
        })
    }
    { this.state.commentform ?(
    <form onSubmit={this.handleSubmit} >
                <textarea className="white-text" placeholder="comment" id="comment" type="text" onChange={this.handleChange}/>
                <button type="submit" className=" btn orange center">Comment</button><br/>
    </form>):(
        <p onClick={()=>{this.setState({commentform: true})}}>Add a Comment</p>
    )
    }
</div>

)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        addLink: (data)=> {dispatch(addQCommentComment(data))},
    }
}

export default connect(null, mapDispatchToProps)(OneQuestionCommentComment)