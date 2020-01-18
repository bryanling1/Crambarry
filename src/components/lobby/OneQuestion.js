import React, {Component} from "react"
import firebase from "firebase/app"
import {upvotequestion, downvotequestion, deleteQuestion} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import OneQuestionAnswers from "./OneQuestionAnswers"
import {hoursAgo} from "../class/Resources"
class OneQuestion extends Component{
    state={
        linksform: false,
        links: null,
        room: null,
        title: null,
        url: null,
        seconds: null,
        http: null
    }
    openDelete=(e) =>{
        this.setState({delete: true, linkidtodelete: e.target.id})
    }
    closeDelete=()=>{
        this.setState({delete: false})
    }

    deleteLink = () =>{
        this.props.deleteQuestion({lobby: this.props.roomName, linkid: this.state.linkidtodelete})
        this.props.backtoquestions()
    }
    //gets the links and sets the state as an object 
    getLinks = () =>{
        firebase.firestore().collection("lobbies/"+this.props.roomName+"/questions").doc(this.props.questionid).get().then(data=>{
            let links = [];
            if(data.data()){
                links.push({...data.data(), id: data.id});
                this.setState({links: links})
            }else{
                this.props.backtoquestions()
            }
            
        })
    }
    upvote=(e)=>{
        this.props.upvotequestion({lobby: this.props.roomName, id: e.target.id});
        var stateCopy = [...this.state.links];
        const user = this.props.userid;
        stateCopy.forEach(function(obj) {
            if (obj.id === e.target.id) {
                //see if already upvoted
                if(obj.upvoters.includes(user)){
    
                }else if(obj.downvoters.includes(user)){
                    obj.rating += 2
                    obj.upvoters.push(user)  
                    for(var x in obj.downvoters) {
                        if(obj.downvoters[x] === user) {
                            delete obj.downvoters[x];
                        }
                    }
                }
                else{     
                    obj.rating += 1
                    obj.upvoters.push(user)
                }
            }
        });
        this.setState({links: stateCopy})
    }
    downvote=(e)=>{
        this.props.downvotequestion({lobby: this.props.roomName, id: e.target.id});
        var stateCopy = [...this.state.links];
        const user = this.props.userid;
        stateCopy.forEach(function(obj) {
            if (obj.id === e.target.id) {
                //see if already upvoted
                if(obj.downvoters.includes(user)){
    
                }else if(obj.upvoters.includes(user)){
                    obj.rating -= 2
                    obj.downvoters.push(user)  
                    for(var x in obj.upvoters) {
                        if(obj.upvoters[x] === user) {
                            delete obj.upvoters[x];
                        }
                    }
                }
                else{     
                    obj.rating -= 1
                    obj.downvoters.push(user)
                }
            }
        });
        this.setState({links: stateCopy})
    }
    upvotetoneutral=(e)=>{
        this.props.upvotequestion({lobby: this.props.roomName, id: e.target.id});
        var stateCopy = [...this.state.links];
        const user = this.props.userid;
        stateCopy.forEach(function(obj) {
            if (obj.id === e.target.id) {
                obj.rating -= 1  
                for(var x in obj.upvoters) {
                    if(obj.upvoters[x] === user) {
                        delete obj.upvoters[x];
                    }
                }
                
            }
        });
        this.setState({links: stateCopy})
    }
    
    downvotetoneutral=(e)=>{
        this.props.downvotequestion({lobby: this.props.roomName, id: e.target.id});
        var stateCopy = [...this.state.links];
        const user = this.props.userid;
        stateCopy.forEach(function(obj) {
            if (obj.id === e.target.id) {
                obj.rating += 1  
                for(var x in obj.downvoters) {
                    if(obj.downvoters[x] === user) {
                        delete obj.downvoters[x];
                    }
                }
                
            }
        });
        this.setState({links: stateCopy})
    }
    componentDidMount(){
        this.getLinks();
    }
render(){
    
return(
<div>
<div className="one-question">
    <p className="go-back" style={{position: "absolute", top: "-40px", zIndex: "700"}} onClick={()=>{this.props.backtoquestions()}}>{"< Back to Questions"}</p>
{
            //Delete a link
            this.state.delete && <div className="delete-link" onClick={this.closeDelete}>
                <div className="delete-link-panel">
                    <h1>Delete Comment?</h1>
                    <h2>This comment will be permanently deleted</h2>
                    <div className="center">
                    <button className="btn red" onClick={this.deleteLink} >YES</button><button onClick={this.closeDelete} className="btn blue">NO</button>
                    </div>
                </div>
            </div>
        }
{
        this.state.links && this.state.links.map(data=>{
            const upButton = data.upvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.upvotetoneutral} className="material-icons up-color-lock">arrow_drop_up</i>):(<i onClick={this.upvote} id={data.id} className="material-icons up-color">arrow_drop_up</i>); 
            const downButton = data.downvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.downvotetoneutral} className="material-icons down-color-lock">arrow_drop_down</i>):(<i onClick={this.downvote} id={data.id} className="material-icons down-color">arrow_drop_down</i>);
            const profileImage = data.profilePic?(data.profilePic):("default");
            let numberStyle = null;
            if(data.upvoters.includes(this.props.userid)){
                numberStyle = "up-color-lock";
            }else if(data.downvoters.includes(this.props.userid)){
                numberStyle = "down-color-lock";
            }
            return(<div className="resources-link resources-question resources-question-main" style={{backgroundColor: "#111", borderLeft: "0px"}}key={data.id}>
                    <div className="vote-arrows">
                    {upButton}
                    <div className={"vote-number "+numberStyle}>{data.rating}</div>
                    {downButton}
                    </div>
                    <div  style={{backgroundImage: "url('/images/profile/"+profileImage+".png'"}} className="resources-link-profile"></div>
                    <p className={data.answered?("answered light-green-text text-accent-3"):("answered")} >{data.answered?("Answered"):("Unanswered")}</p>
                    <div className="resources-link-text">
                        <h1 className={data.answered ?("light-green-text text-accent-3"):(null)}>{data.title}</h1>
                        <h2>{data.description}</h2>
                        <p>{data.name+" ("+data.username+") "}<i className="material-icons resources-time">access_time</i>{hoursAgo(data.date.seconds)}</p>
                        {data.image && <img alt={data.image} style={{maxWidth: "90%"}}src={data.image}/>}
                    </div>
                    {data.userid === this.props.userid ? (<i id={data.id} onClick={this.openDelete} className="material-icons delete-icon">delete</i>):(null)}
                </div>);
            })
}
<OneQuestionAnswers reset={()=>{this.getLinks()}} questionTitle={this.props.questionTitle} authorid={this.props.authorid}  questionid={this.props.questionid} roomName={this.props.roomName} userid={this.props.userid} />
</div>

</div>
)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        upvotequestion: (data)=> {dispatch(upvotequestion(data))},
        downvotequestion: (data)=> {dispatch(downvotequestion(data))},
        deleteQuestion: (data)=> {dispatch(deleteQuestion(data))}
    }
}

export default connect(null, mapDispatchToProps)(OneQuestion)