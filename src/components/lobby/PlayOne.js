import React, {Component} from "react"
import {firebaseConnect} from "react-redux-firebase"
import {connect} from "react-redux"
import {compose} from "redux"
import {createQuestion, updateQuestion, deleteUnitQuestion, starQuestion, unStarQuestion, createQuestionRequest} from "../../store/actions/resourcesActions"
import {hoursAgo} from "../class/Resources"
import PlayRequests from "./PlayRequests"
import Play from "./Play"

class PlayOne extends Component{
state={
    createQuestionForm: false,
    questionType: null,
    question: null,
    questionImageUrl: null,
    answer: null,
    answerImageUrl: null,
    option2: null,
    option3: null,
    option4: null,
    delete: false,
    requests: false,
    play: false,
    starMode: false, 
    areStars: false
}
handleChange=(e)=>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
checkStars = () =>{
    var areStars = false;
    this.props.questions &&  Object.values(this.props.questions).map(data=>{
        if(data.stars && data.stars[this.props.userID]){
            return areStars = true;
        }
        return null
    })
    return areStars
}

handleCreateQuestion=(e)=>{
    e.preventDefault();
    //for multiple choice and short answer, question can be null if questionimageUrl is defined
    if(this.state.questionType === "mc" || this.state.questionType === "sa"){
        if(this.state.question || this.state.questionImageUrl){
            if(this.state.questionType === "mc"){
                if(this.state.answer && this.state.option2 && this.state.option3 && this.state.option4){
                    this.props.createQuestion(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID
                        }
                    )
                    this.setState({
                        createQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null
                    })
                }
            }else{
                if(this.state.answer){
                    this.props.createQuestion(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID
                        }
                    )
                    this.setState({
                        createQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null
                    })
                }
            }
            
        }
    }else if(this.state.questionType === "fc"){
        if( (this.state.question || this.state.questionImageUrl) && (this.state.answer || this.state.answerImageUrl) ){
            this.props.createQuestion(
                {lobby: this.props.roomName, 
                type: "fc", 
                question: this.state.question,
                questionImage: this.state.questionImageUrl,
                answer: this.state.answer,
                answerImage: this.state.answerImageUrl,
                option2: this.state.option2,
                option3: this.state.option3,
                option4: this.state.option4,
                unitID: this.props.unitID
                }
            )
            this.setState({
                createQuestionForm: false,
                questionType: null,
                question: null,
                questionImageUrl: null,
                answer: null,
                answerImageUrl: null,
                option2: null,
                option3: null,
                option4: null,
                requestProcesssed: true
            })
        }
    }
}
handleCreateQuestionRequest=(e)=>{
    e.preventDefault();
    //for multiple choice and short answer, question can be null if questionimageUrl is defined
    if(this.state.questionType === "mc" || this.state.questionType === "sa"){
        if(this.state.question || this.state.questionImageUrl){
            if(this.state.questionType === "mc"){
                if(this.state.answer && this.state.option2 && this.state.option3 && this.state.option4){
                    this.props.createQuestionRequest(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID
                        }
                    )
                    this.setState({
                        createQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null,
                        requestProcesssed: true
                    })
                }
            }else{
                if(this.state.answer){
                    this.props.createQuestionRequest(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID
                        }
                    )
                    this.setState({
                        createQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null, 
                        requestProcesssed: true
                    })
                }
            }
            
        }
    }else if(this.state.questionType === "fc"){
        if( (this.state.question || this.state.questionImageUrl) && (this.state.answer || this.state.answerImageUrl) ){
            this.props.createQuestionRequest(
                {lobby: this.props.roomName, 
                type: "fc", 
                question: this.state.question,
                questionImage: this.state.questionImageUrl,
                answer: this.state.answer,
                answerImage: this.state.answerImageUrl,
                option2: this.state.option2,
                option3: this.state.option3,
                option4: this.state.option4,
                unitID: this.props.unitID
                }
            )
            this.setState({
                createQuestionForm: false,
                questionType: null,
                question: null,
                questionImageUrl: null,
                answer: null,
                answerImageUrl: null,
                option2: null,
                option3: null,
                option4: null
            })
        }
    }
}
//update question
handleUpdateQuestion=(e)=>{
    e.preventDefault();
    //for multiple choice and short answer, question can be null if questionimageUrl is defined
    if(this.state.questionType === "mc" || this.state.questionType === "sa"){
        if(this.state.question || this.state.questionImageUrl){
            if(this.state.questionType === "mc"){
                if(this.state.answer && this.state.option2 && this.state.option3 && this.state.option4){
                    this.props.updateQuestion(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID,
                        questionID: this.state.questionUpdateID
                        }
                    )
                    this.setState({
                        updateQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null
                    })
                }
            }else{
                if(this.state.answer){
                    this.props.updateQuestion(
                        {lobby: this.props.roomName, 
                        type: this.state.questionType === "mc"?("mc"):("sa"), 
                        question: this.state.question,
                        questionImage: this.state.questionImageUrl,
                        answer: this.state.answer,
                        answerImage: this.state.answerImageUrl,
                        option2: this.state.option2,
                        option3: this.state.option3,
                        option4: this.state.option4,
                        unitID: this.props.unitID,
                        questionID: this.state.questionUpdateID
                        }
                    )
                    this.setState({
                        updateQuestionForm: false,
                        questionType: null,
                        question: null,
                        questionImageUrl: null,
                        answer: null,
                        answerImageUrl: null,
                        option2: null,
                        option3: null,
                        option4: null,
                        
                    })
                }
            }
            
        }
    }else if(this.state.questionType === "fc"){
        if( (this.state.question || this.state.questionImageUrl) && (this.state.answer || this.state.answerImageUrl) ){
            this.props.updateQuestion(
                {lobby: this.props.roomName, 
                type: "fc", 
                question: this.state.question,
                questionImage: this.state.questionImageUrl,
                answer: this.state.answer,
                answerImage: this.state.answerImageUrl,
                option2: this.state.option2,
                option3: this.state.option3,
                option4: this.state.option4,
                unitID: this.props.unitID,
                questionID: this.state.questionUpdateID
                }
            )
            this.setState({
                updateQuestionForm: false,
                questionType: null,
                question: null,
                questionImageUrl: null,
                answer: null,
                answerImageUrl: null,
                option2: null,
                option3: null,
                option4: null
            })
        }
    }
}
//delete question from set
deleteQuestion=(e)=>{
    e.preventDefault()
    this.props.deleteUnitQuestion({lobby: this.props.roomName, unitID: this.props.unitID, questionID: this.state.deleteQuestionID, authorID: this.state.authorID });
    this.setState({delete: false})
}
componentDidMount(){
    this.props.updateNotificationsSeen()
}
render(){
return(
<div className="resources-links-list-all">
    {
        //submit a question
        this.state.createQuestionForm && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-play-form">
            <h1>{this.props.isAdmin || this.props.isOwner?("Create a Question"):("Question Request")}</h1>
            <p>{this.props.isAdmin || this.props.isOwner?(null):("Will first be approved by an Admin")}</p>
            <form className="col s12" onSubmit={this.props.isAdmin || this.props.isOwner?(this.handleCreateQuestion):(this.handleCreateQuestionRequest)}>
                    <div className="row"  style={{marginBottom: "0px"}}>
                    <div className="input-field col s6"  style={{marginBottom: "0px"}}>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({questionType: "mc"})}} name="group1" type="radio" />
                            <span className="radio-width-2">Multiple Choice</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({questionType: "fc"})}} name="group1" type="radio" />
                            <span className="radio-width-2">Flash Card</span>
                        </label>
                    </p>
                    </div>
                    <div className="input-field col s6"  style={{marginBottom: "0px"}}>
                    <p>
                        <label>
                            <input onClick={()=>{this.setState({questionType: "sa"})}} name="group1" type="radio" />
                            <span className="radio-width-2">Short Answer</span>
                        </label>
                    </p>
                    </div>
                    </div>
                <div style={{marginBottom: "0px"}} className="row">
                    <div style={{marginBottom: "0px"}} className="input-field col s12">
                    <textarea  id="question" type="text" onChange={this.handleChange}/>
                    <label className="active" htmlFor="question">Question</label>
                    </div> 
                </div>
                <div className="row">
                    <div  style={{marginBottom: "0px"}} className="input-field col s12">
                    <input  id="questionImageUrl" type="text" onChange={this.handleChange}/>
                    <label htmlFor="questionImageUrl">Image URL</label>
                    </div> 
                </div>
                {
                this.state.questionType !== "mc" 
                ?(this.state.questionType !== "sa"?(<div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s8">
                    <input  id="answer" type="text" onChange={this.handleChange}/>
                    <label htmlFor="answer">Answer</label>
                    </div> 
                    <div  style={{marginBottom: "0px"}} className="input-field col s4">
                    <input  id="answerImageUrl" type="text" onChange={this.handleChange}/>
                    <label htmlFor="answerImageUrl">Image URL</label>
                    </div> 
                </div>):(
                    <div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s12">
                    <input  id="answer" type="text" onChange={this.handleChange}/>
                    <label htmlFor="answer">Answer</label>
                    </div> 
                </div>
                ))
                :(<div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  id="answer" type="text" onChange={this.handleChange}/>
                    <label htmlFor="answer">Answer</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  id="option2" type="text" onChange={this.handleChange}/>
                    <label htmlFor="option2">Option 2</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  id="option3" type="text" onChange={this.handleChange}/>
                    <label htmlFor="option3">Option 3</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  id="option4" type="text" onChange={this.handleChange}/>
                    <label htmlFor="option4">Option 4</label>
                    </div> 
                </div>)
            }
                <div className="row">
                <button type="submit">CREATE</button><br/>
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={()=>{this.setState({createQuestionForm: false})}}></div>
            </div> 
    }
    {
            //Delete Question
            this.state.delete && <div className="delete-link" onClick={()=>{this.setState({delete: false})}}>
                <div className="delete-link-panel">
                    <h1>Delete Question?</h1>
                    <h2>This question will be permanently deleted</h2>
                    <div className="center">
                    <button className="btn red" onClick={this.deleteQuestion} >YES</button><button onClick={()=>{this.setState({delete: false})}} className="btn grey">NO</button>
                    </div>
                </div>
            </div>
    }
    {
            //Show request has been sent
            this.state.requestProcesssed && <div className="delete-link" onClick={()=>{this.setState({requestProcesssed: false})}}>
                <div className="delete-link-panel">
                    <h1>Question Request</h1>
                    <h2>Your request has been sent to an Admin</h2>
                    <div className="center">
                        <button onClick={()=>{this.setState({requestProcesssed: false})}} className="btn grey">OK</button>
                    </div>
                </div>
            </div>
    }
    {
        //edit a question
        this.state.updateQuestionForm && 
            <div className="resources-links-form-outer">
            <div className="resources-links-form resources-play-form">
            <h1>Edit Question</h1>
            <form className="col s12" onSubmit={this.handleUpdateQuestion}>
                    <div className="row"  style={{marginBottom: "0px"}}>
                    <div className="input-field col s6"  style={{marginBottom: "0px"}}>
                    <p>
                        <label>
                            <input checked={this.state.questionType === "mc"?("checked"):(null)} onClick={()=>{this.setState({questionType: "mc", answerImageUrl: null})}} name="group1" type="radio" />
                            <span className="radio-width-2">Multiple Choice</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input checked={this.state.questionType === "fc"?("checked"):(null)} onClick={()=>{this.setState({questionType: "fc"})}} name="group1" type="radio" />
                            <span className="radio-width-2">Flash Card</span>
                        </label>
                    </p>
                    </div>
                    <div className="input-field col s6"  style={{marginBottom: "0px"}}>
                    <p>
                        <label>
                            <input checked={this.state.questionType === "sa"?("checked"):(null)} onClick={()=>{this.setState({questionType: "sa", answerImageUrl: null})}} name="group1" type="radio" />
                            <span className="radio-width-2">Short Answer</span>
                        </label>
                    </p>
                    </div>
                    </div>
                <div style={{marginBottom: "0px"}} className="row">
                    <div style={{marginBottom: "0px"}} className="input-field col s8">
                    <label className={this.state.question?("active"):(null)}>Question</label>
                    <input  value={this.state.question?(this.state.question):(null)} id="question" type="text" onChange={this.handleChange}/>
                    
                    </div> 
                    <div  style={{marginBottom: "0px"}} className="input-field col s4">
                    <label className={this.state.questionImageUrl?("active"):(undefined)}>Image URL</label>
                    <input value={this.state.questionImageUrl?(this.state.questionImageUrl):(undefined)} id="questionImageUrl" type="text" onChange={this.handleChange}/>
                    </div> 
                </div>
                {
                this.state.questionType !== "mc" 
                ?(this.state.questionType !== "sa"?(<div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s8">
                    <input value={ this.state.answer ? (this.state.answer):(null)} id="answer" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answer?("active"):(null)} htmlFor="answer">Answer</label>
                    </div> 
                    <div  style={{marginBottom: "0px"}} className="input-field col s4">
                    <input  value={this.state.answerImageUrl?(this.state.answerImageUrl):(undefined)} id="answerImageUrl" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answerImageUrl?("active"):(undefined)} htmlFor="answerImageUrl">Image URL</label>
                    </div> 
                </div>):(
                    <div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s12">
                    <input  value={ this.state.answer ? (this.state.answer):(null)} id="answer" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answer?("active"):(null)}  htmlFor="answer">Answer</label>
                    </div> 
                </div>
                ))
                :(<div  style={{marginBottom: "0px"}}className="row">
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  value={ this.state.answer ? (this.state.answer):(null)} id="answer" type="text" onChange={this.handleChange}/>
                    <label className={this.state.answer?("active"):(null)} htmlFor="answer">Answer</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input value={ this.state.option2 ? (this.state.option2):(null)} id="option2" type="text" onChange={this.handleChange}/>
                    <label className={this.state.option2 ?("active"):(null)} htmlFor="option2">Option 2</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input  value={ this.state.option3 ? (this.state.option3):(null)}id="option3" type="text" onChange={this.handleChange}/>
                    <label className={this.state.option3 ?("active"):(null)}htmlFor="option3">Option 3</label>
                    </div> 
                    <div   style={{marginBottom: "0px"}}className="input-field col s6">
                    <input value={ this.state.option4 ? (this.state.option4):(null)} id="option4" type="text" onChange={this.handleChange}/>
                    <label className={this.state.option4 ?("active"):(null)}htmlFor="option4">Option 4</label>
                    </div> 
                </div>)
            }
                <div className="row">
                <button type="submit">UPDATE</button><br/>
                </div>
            </form>
            </div>
            <div className="resources-links-form-close" onClick={()=>{this.setState({updateQuestionForm: false})}}></div>
            </div> 
    }
    {
    //show the quettions in the set
    !this.state.requests && !this.state.play?(
    <div>
    <div className="row play-butons-row" style={{margin: 0}}>
    <p style={{cursor: "pointer", position: "relative", top: "-10px"}}onClick={this.props.backToUnits}className="white-text">{"< Back to Units"}</p>
    <div className="center">
    <button onClick={()=>{this.setState({play: true})}}className="btn-small pulse green accent-4"><i className="material-icons">play_arrow</i>PLAY</button>
    <button onClick={()=>{this.checkStars() && this.setState({play: true, starMode: true})}}className="btn-small yellow darken-1"><i className="material-icons">star</i>Starred</button>
    </div>
    {this.props.isAdmin || this.props.isOwner?(<button onClick={()=>{this.setState({requests: true})}} className={this.props.unit[this.props.unitID]["requests"]>0?("pulse btn-small requests  red darken-2"):("btn-small requests  red darken-2")}>Requests({this.props.unit[this.props.unitID]["requests"]})</button>):(null)}
    </div>
    <div className="create-set" onClick={()=>{this.setState({createQuestionForm: true})}}>
            + Question
    </div>
    {
        //map the question in the database
        this.props.questions && Object.entries(this.props.questions).map(data=>{
            return(
                <div key={data[0]} className="question-preview-container" style={{position: "relative"}}>
                    {this.props.isAdmin || this.props.isOwner  ? (<i onClick={()=>{this.setState({updateQuestionForm: true, 
                        truecreateQuestionForm: false,
                        questionType: data[1].type,
                        question: data[1].question ? (data[1].question):(null),
                        questionImageUrl: data[1].questionPicture ? (data[1].questionPicture):(null),
                        answer: data[1].answer ? (data[1].answer):(null),
                        answerImageUrl: data[1].answerPicture ? (data[1].answerPicture):(null),
                        option2: data[1].option2 ? (data[1].option2):(null),
                        option3: data[1].option3 ? (data[1].option3):(null),
                        option4: data[1].option4 ? (data[1].option4):(null),
                        questionUpdateID: data[0]
                        })}} className="material-icons edit-icon">edit</i>):(null)}
                    {this.props.isAdmin || this.props.isOwner  ? (<i onClick={()=>{this.setState({delete: true, deleteQuestionID: data[0], authorID: data[1].authorID})}} className="material-icons delete-icon">delete</i>):(null)}
                    <p className="set-star" onClick={()=>{
                        data[1].stars && data[1].stars[this.props.userID]?(this.props.unStarQuestion({lobby:this.props.roomName, unitID: this.props.unitID, questionID: data[0]})):(this.props.starQuestion({lobby:this.props.roomName, unitID: this.props.unitID, questionID: data[0]}))
                        }}>
                        <i className={data[1].stars && data[1].stars[this.props.userID]?("yellow-text material-icons "):("material-icons ")}>{data[1].stars && data[1].stars[this.props.userID]?("star"):("star_border")}</i>
                    </p>
                    <p className="set-username"><i className="material-icons">person</i>{data[1].authorUsername}</p>
                    <p className="set-last-edit"><i className="material-icons">access_time</i>{hoursAgo(new Date(data[1].lastEdit).getTime()/1000)}</p>
                    <div className="question-preview-side">
                        {
                            <p>{data[1].question}</p>
                        }
                        {
                            data[1].questionPicture?(
                                <img alt={data[1].questionPicture} src={data[1].questionPicture}/>
                            ):(null)
                        }
                    </div>
                    <div className="question-preview-side">
                    {
                           <p>{data[1].answer}</p>
                    }
                    {
                            data[1].answerPicture?(
                                <img alt={data[1].answerPicture} src={data[1].answerPicture}/>
                            ):(null)
                        }
                    </div>
                </div>
            )
        })
    }
    
    </div>):(
        !this.state.play ?(
        <PlayRequests unit={this.props.unit} isOwner={this.props.isOwner} isAdmin={this.props.isAdmin} userID={this.props.userid} roomName={this.props.roomName} unitID={this.props.unitID} backToUnits={()=>{this.setState({requests: false})}}/>
    ):(<Play userxp={this.props.userxp} starMode={this.state.starMode} roomName={this.props.roomName} unitID={this.props.unitID} userID={this.props.userID} questions={this.props.questions} backToQuestions={()=>{this.setState({play: false})}}/>))
    }
    
</div>
)
}
} 
const mapStateToProps = (state, ownProps) =>{
    return{
        questions: state.firebase.data.questions && state.firebase.data.questions[ownProps.roomName][ownProps.unitID],
    }
}
const mapDispatchToProps=(dispatch)=>{
    return{
        createQuestion: (data) =>{dispatch(createQuestion(data))},
        deleteUnitQuestion: (data)=>{dispatch(deleteUnitQuestion(data))},
        updateQuestion: (data)=>{dispatch(updateQuestion(data))},
        starQuestion: (data)=>{dispatch(starQuestion(data))},
        unStarQuestion: (data)=>{dispatch(unStarQuestion(data))},
        createQuestionRequest: (data) =>{dispatch(createQuestionRequest(data))},
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect((props)=>{
        return[
            {path: "questions/"+props.roomName+"/"+props.unitID},
        ]
    }),
    
)(PlayOne)