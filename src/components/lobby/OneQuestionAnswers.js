import React, {Component} from "react"
import firebase from "firebase/app"
import {upvoteQuestionComment, downvoteQuestionComment, addQuestionComment, deleteQuestionComment, markAnswer, updateQuestionComment} from "../../store/actions/resourcesActions"
import {connect} from "react-redux"
import OneQuestionsCommentComment from "./OneQuestionCommentComment"
import {hoursAgo} from "../class/Resources"

class OneQuestionAnswers extends Component{
state={
    linksform: false,
    links: null,
    room: null,
    title: null,
    url: null,
    seconds: null,
    http: null,
    alreadyCommented: false,
    answerForm: false,
    answertomark: null
}
markAnswer = () =>{
    console.log(this.state)
    this.props.markAnswer({questionTitle: this.props.questionTitle, lobby: this.props.roomName, commentid: this.state.answertomark, questionid: this.props.questionid, answerAuthor: this.state.answerAuthor})
   this.getLinksTop()
   this.props.reset()
}
deleteLink = () =>{
    this.props.deleteLink({lobby: this.props.roomName, linkid: this.state.linkidtodelete})
    this.closeDelete()
}
openDelete=(e) =>{
    this.setState({delete: true, linkidtodelete: e.target.id})
}
closeDelete=()=>{
    this.setState({delete: false})
}
openformanswer = (e) =>{
    this.setState({answerForm: true, answertomark: e.target.id})
}
closeformanswer = () =>{
    this.setState({answerForm: false})
}
openform = () =>{
    this.setState({linksform: true})
}
closeform = () =>{
    this.setState({linksform: false, seconds: null})
}
deleteLink = () =>{
    this.props.deleteLink({lobby: this.props.roomName, commentid: this.state.linkidtodelete, questionid: this.props.questionid})
    this.closeDelete()
    this.getLinks();
}
handleSubmit = (e) =>{
    e.preventDefault()
    if(this.state.comment){
            if(this.state.comment.length > 6 && this.state.comment.length < 1000){
                if(!this.state.alreadyCommented){
                    this.props.addLink({questionTitle: this.props.questionTitle, authorid: this.props.authorid, lobby: this.props.roomName, id: this.props.questionid,  comment: this.state.comment, image: this.state.imageurl})
                    this.setState({linksform: false, seconds: null, toomany: null, comment: null, image: null})
                    this.getLinks();
                }else{
                    this.setState({invalid:null})
                    this.setState({toomany:"too many"})
                }
                }else{
                    this.setState({invalid:"invalid link"})
                }
            
    }
}
handleSubmitEdit = (e) =>{
    e.preventDefault()
    if(this.state.editComment){
            if(this.state.editComment.length > 6 && this.state.editComment.length < 1000){
                    this.props.updateQuestionComment({lobby: this.props.roomName, questionid: this.state.editQuestionID, commentid:  this.state.editID, comment: this.state.editComment, image: this.state.editImage})
                    this.setState({openEdit: false, seconds: null, toomany: null, comment: null, image: null, editinvalid: false})
                    this.getLinks();
                }else{
                    this.setState({editinvalid: true})
                    console.log("too short")
                }
            
    }
}
handleChange = (e) =>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
//gets the links and sets the state as an object 
getLinks = () =>{
    this.setState({alreadyCommented: false, questionAnswered: false})
    firebase.firestore().collection("lobbyQuestionResponses/"+this.props.roomName+"/"+this.props.questionid).orderBy("date", "desc").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            if(data.data().userid === this.props.userid){       
                this.setState({alreadyCommented: true})
            }
            if(data.data().answer){
                this.setState({questionAnswered: true})
            }
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
getLinksTop = () =>{
    this.setState({alreadyCommented: false, questionAnswered: false})
    firebase.firestore().collection("lobbyQuestionResponses/"+this.props.roomName+"/"+this.props.questionid).orderBy("rating", "desc").get().then(snapshot=>{
        let links = [];
        snapshot.forEach(data=>{
            if(data.data().userid === this.props.userid){
                this.setState({alreadyCommented: true})
            }
            if(data.data().answer){
                this.setState({questionAnswered: true})
            }
            links.push({...data.data(), id: data.id});
        })
        this.setState({links: links})
    })
}
upvote=(e)=>{
    this.props.upvote({questionTitle: this.props.questionTitle, lobby: this.props.roomName, commentid: e.target.id, questionid: this.props.questionid});
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
    this.props.downvote({lobby: this.props.roomName, commentid: e.target.id, questionid: this.props.questionid});
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
    this.props.upvote({lobby: this.props.roomName, commentid: e.target.id, questionid: this.props.questionid});
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
    this.props.downvote({lobby: this.props.roomName, commentid: e.target.id, questionid: this.props.questionid});
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
componentWillReceiveProps(){
    if(this.state.room !== this.props.roomName){
        this.setState({room:this.props.roomName});
        this.getLinks();
    }
}
componentDidMount(){
    this.getLinks();
}
render(){
return(
<div className="resources-links ">
    {
            //edit comment
            this.state.openEdit && <div className="delete-link" >
                <div className="edit-comment-panel">
                    <h1>Edit Comment</h1>
                    <form className="col s12 questions-response-form" onSubmit={this.handleSubmitEdit}>
                        <div className="row">
                            <div className="input-field col s12">
                            <input placeholder="Image URL(Optional)"id="editImage" type="text" value={this.state.editImage?(this.state.editImage):("")} onChange={this.handleChange}/>
                            </div>

                            <div className="input-field col s12">
                            <textarea placeholder="comment" id="editComment" type="text" value={this.state.editComment} onChange={this.handleChange}/>
                            </div>
                            <button type="submit" className=" btn orange center">Edit</button><br/>
                            {
                                this.state.editinvalid && <p style={{position: "absolute", right: "0", bottom: "0px", left: "20px"}} className="red-text">Comment is too short / long</p>
                            }
                        </div>
                    </form>
                </div>
                <div className="close-edit-comment" onClick={()=>{this.setState({openEdit: false})}}>

                </div>
            </div>
        }
        {
            //Mark as answered
            this.state.answerForm && <div className="delete-link" onClick={this.closeformanswer}>
                <div className="delete-link-panel">
                    <h1>Mark as Answer?</h1>
                    <h2>This action cannot be undone</h2>
                    <div className="center">
                    <button className="btn  light-green accent-3" onClick={this.markAnswer} >YES</button><button onClick={this.closeformanswer} className="btn red">NO</button>
                    </div>
                </div>
            </div>
        }
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
        
        <div className="resources-links-menu-bar one-question-answers">
            <div className="resources-links-menu-bar-text"><div className="sort-by">SORT BY: </div><div onClick={this.getLinks} className="resources-links-menu-wrapper new-hover"><i className="material-icons">new_releases</i>New </div><div onClick={this.getLinksTop} className="resources-links-menu-wrapper top-hover"><i className="material-icons">trending_up</i>Top</div></div>
        </div>
        {
        //return the answre
        this.state.links && this.state.links.map(data=>{
            if (data.answer){
            const upButton = data.upvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.upvotetoneutral} className="material-icons up-color-lock">arrow_drop_up</i>):(<i id={data.id} onClick={this.upvote} className="material-icons up-color">arrow_drop_up</i>); 
            const downButton = data.downvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.downvotetoneutral} className="material-icons down-color-lock">arrow_drop_down</i>):(<i id={data.id} onClick={this.downvote} className="material-icons down-color">arrow_drop_down</i>);
            const profileImage = data.profilePic?(data.profilePic):("default");
            let numberStyle = null;
            if(data.upvoters.includes(this.props.userid)){
                numberStyle = "up-color-lock";
            }else if(data.downvoters.includes(this.props.userid)){
                numberStyle = "down-color-lock";
            }
            return(<div style={ data.answer?({borderLeft: "#76ff03 5px solid", position: "relative"}):(null) } className="resources-link resources-question" key={data.id}>
                    <div className="vote-arrows">
                    {upButton}
                    <div className={"vote-number "+numberStyle}>{data.rating}</div>
                    {downButton}
                    </div>
                    <div  style={{backgroundImage: "url('/images/profile/"+profileImage+".png'"}} className="resources-link-profile"></div>
                    <div className="resources-link-text">
                        <p>{data.name+" ("+data.username+") "}<i className="material-icons resources-time">access_time</i>{hoursAgo(data.date.seconds)}
                           {data.answer?(<i style={{color: "#76ff03", fontSize: "23px", position: "relative", lineHeight: "0px", top: "7px", left: "3px"}}className="material-icons">check</i>):(null)}
                            {this.props.authorid === this.props.userid && !this.state.questionAnswered ?(<i id={data.id} onClick={()=>{this.setState({answerForm: true, answertomark: data.id, answerAuthor: data.userid})}} className="mark-answer material-icons">check</i>):(null)}
                            </p>
                        <p className={"white-text"}>{data.comment}</p>
                        {data.image && <img alt={data.image} style={{maxWidth: "90%"}}src={data.image}/>}
                    </div>
                    {data.userid === this.props.userid && !data.answer ? (<div><i id={data.id} onClick={()=>this.setState({openEdit:true, editQuestionID: this.props.questionid, editID: data.id, editComment: data.comment, editImage: data.image})} className="material-icons edit-icon">edit</i><i id={data.id} onClick={this.openDelete} className="material-icons delete-icon">delete</i></div>):(null)}
                    <div className="line-break"> </div>
                    {
                        this.state[data.id] ?(<OneQuestionsCommentComment questionTitle={this.props.questionTitle} authorid={this.props.authorid} commentid={data.id} lobby={this.props.roomName} questionid={this.props.questionid}/>):(
                            data.comments?(<p className="show-comments"onClick={()=>{this.setState({[data.id]: true})}}>Show Comments ({data.comments && data.comments})</p>):(
                                <OneQuestionsCommentComment questionTitle={this.props.questionTitle}  authorid={this.props.authorid} commentid={data.id} lobby={this.props.roomName} questionid={this.props.questionid}/>
                            )
                            
                        )
                    }
                </div>);
            }else{
                return null
            }
            })
        
        }
        {
        //return non answers
        this.state.links && this.state.links.map(data=>{
            if (!data.answer){
            const upButton = data.upvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.upvotetoneutral} className="material-icons up-color-lock">arrow_drop_up</i>):(<i id={data.id} onClick={this.upvote} className="material-icons up-color">arrow_drop_up</i>); 
            const downButton = data.downvoters.includes(this.props.userid) ? (<i id={data.id} onClick={this.downvotetoneutral} className="material-icons down-color-lock">arrow_drop_down</i>):(<i id={data.id} onClick={this.downvote} className="material-icons down-color">arrow_drop_down</i>);
            const profileImage = data.profilePic?(data.profilePic):("default");
            let numberStyle = null;
            if(data.upvoters.includes(this.props.userid)){
                numberStyle = "up-color-lock";
            }else if(data.downvoters.includes(this.props.userid)){
                numberStyle = "down-color-lock";
            }
            return(<div style={ data.answer?({borderLeft: "#76ff03 5px solid", position: "relative"}):(null) } className="resources-link resources-question" key={data.id}>
                    <div className="vote-arrows">
                    {upButton}
                    <div className={"vote-number "+numberStyle}>{data.rating}</div>
                    {downButton}
                    </div>
                    <div  style={{backgroundImage: "url('/images/profile/"+profileImage+".png'"}} className="resources-link-profile"></div>
                    <div className="resources-link-text">
                        <p>{data.name+" ("+data.username+") "}<i className="material-icons resources-time">access_time</i>{hoursAgo(data.date.seconds)}
                           {data.answer?(<i style={{color: "#76ff03", fontSize: "23px", position: "relative", lineHeight: "0px", top: "7px", left: "3px"}}className="material-icons">check</i>):(null)}
                            {this.props.authorid === this.props.userid && !this.state.questionAnswered ?(<i id={data.id} onClick={()=>{this.setState({answerForm: true, answertomark: data.id, answerAuthor: data.userid})}} className="mark-answer material-icons">check</i>):(null)}
                            </p>
                        <p className={"white-text"}>{data.comment}</p>
                        {data.image && <img alt={data.image} style={{maxWidth: "90%"}}src={data.image}/>}
                    </div>
                    {data.userid === this.props.userid && !data.answer ? (<div><i id={data.id} onClick={()=>this.setState({openEdit:true, editQuestionID: this.props.questionid, editID: data.id, editComment: data.comment, editImage: data.image})} className="material-icons edit-icon">edit</i><i id={data.id} onClick={this.openDelete} className="material-icons delete-icon">delete</i></div>):(null)}
                    <div className="line-break"> </div>
                    {
                        this.state[data.id] ?(<OneQuestionsCommentComment questionTitle={this.props.questionTitle}  authorid={this.props.authorid} commentid={data.id} lobby={this.props.roomName} questionid={this.props.questionid}/>):(
                            data.comments?(<p className="show-comments"onClick={()=>{this.setState({[data.id]: true})}}>Show Comments ({data.comments && data.comments})</p>):(
                                <OneQuestionsCommentComment questionTitle={this.props.questionTitle} authorid={this.props.authorid} commentid={data.id} lobby={this.props.roomName} questionid={this.props.questionid}/>
                            )
                            
                        )
                    }
                </div>);
            }else{
                return null
            }
            })
        
        }
        
        <div className="resources-link-form-wide"></div>
        {
            this.state.links && this.state.links.length === 0 ? (<p className="white-text">Be the first to comment!</p>):(null)
        }

        <form className="col s12 questions-response-form" onSubmit={this.handleSubmit}>
                <div className="row">
                <h1 className="comment-title">Comment</h1>
                    <div className="input-field col s12">
                    <input placeholder="Image URL(Optional)"id="imageurl" type="text" onChange={this.handleChange}/>
                    </div>

                    <div className="input-field col s12">
                    <textarea placeholder="comment" id="comment" type="text" onChange={this.handleChange}/>
                    </div>
                    <button type="submit" className=" btn orange center">Comment</button><br/>
                    {
                        this.state.invalid && <p style={{position: "absolute", right: "7px", bottom: "20px"}} className="red-text">Your Title or Description is too short / too long</p>
                    }
                    {
                        this.state.toomany && <p style={{position: "absolute", right: "7px", bottom: "20px"}} className="red-text">You already commented. Delete or edit previous response</p>
                    }
                </div>
            </form>
</div>

)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        upvote: (data)=> {dispatch(upvoteQuestionComment(data))},
        downvote: (data)=> {dispatch(downvoteQuestionComment(data))},
        addLink: (data)=> {dispatch(addQuestionComment(data))},
        deleteLink: (data)=> {dispatch(deleteQuestionComment(data))},
        markAnswer: (data)=>{dispatch(markAnswer(data))},
        updateQuestionComment: (data)=>{dispatch(updateQuestionComment(data))}
    }
}

export default connect(null, mapDispatchToProps)(OneQuestionAnswers)