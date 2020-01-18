import React, {Component} from "react"
import {connect} from "react-redux"
import {compose} from "redux"
import {starQuestion, unStarQuestion, giveTokens, addPlayToUnit} from "../../store/actions/resourcesActions"
import {updateXp, givePresent} from "../../store/actions/chatActions"
import {exact_level} from "../class/Profile";

class Play extends Component{
state={
    currentQuestion: 1,
    questions: null,
    answered: false, 
    saanswer: ""
}
nextQuestion=()=>{
    if(this.state.currentQuestion === this.state.questionsLength){
        this.setState({currentQuestion: 1})
    }else{
        this.setState({currentQuestion: this.state.currentQuestion + 1})
    }
    this.messagesStart.scrollIntoView({ behavior: "smooth" });
    //reset the form
    if(document.getElementById("saForm")){
        document.getElementById("saForm").reset();
    }
}
prevQuestion=()=>{
    if(this.state.currentQuestion === 1){
        this.setState({currentQuestion: this.state.questionsLength})
    }else{
        this.setState({currentQuestion: this.state.currentQuestion - 1})
    }
}
resetAllQuestions(){
    let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
    for(var x=0; x<this.state.questionsLength; x++){
        questionsCopy[x].answered = false
        questionsCopy[x].mcArray = this.shuffleArray(questionsCopy[x].mcArray)
    }
    return questionsCopy 
}
resetQuestion(){
    let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
    questionsCopy[this.state.currentQuestion-1].answered = false
    questionsCopy[this.state.currentQuestion-1].mcArray = this.shuffleArray(questionsCopy[this.state.currentQuestion-1].mcArray)
    return questionsCopy 
}
handleResetQuestion=()=>{
    this.setState({questions: this.resetQuestion()})
}
shuffleQuestions=()=>{
    this.setState({questions: this.shuffleArray(this.resetAllQuestions()), currentQuestion: 1})
}
shuffleArray=(array)=> {
    
    let array2 = array;
    for (let i = array2.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array2[i], array2[j]] = [array2[j], array2[i]];
    }
    return array2;
}
handleShowFC=(questionN)=>{
    let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    //make changes
    questionsCopy[questionN].answered = true
    this.setState({
        questions:questionsCopy 
    }) 
}
handleSA=(e, isAnswered, right, questionN, answeredOnce)=>{
    if(e){
        e.preventDefault();
    }
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if(!isAnswered && this.state.saanswer.length > 0){
        if(right){
            let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
            //make changes
            questionsCopy[questionN].answered = true
            questionsCopy[questionN].isCorrect = true
            questionsCopy[questionN].answeredOnce ++
            this.setState({
                questions:questionsCopy 
            }) 
        }else{
            let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
            //make changes
            questionsCopy[questionN].answered = true
            questionsCopy[questionN].isCorrect = false
            questionsCopy[questionN].userAnswer = this.state.saanswer
            this.setState({
                questions:questionsCopy 
            }) 
        }
    }
    //only award if answered once 
    //only award xp if answered once is false
    if(answeredOnce === 0){
        //give a present if the user levels up
        if(exact_level(this.props.userxp) !== exact_level(this.props.userxp+8)){
            this.props.givePresent({uid: this.props.userID})
            this.props.updateXP({uid: this.props.userID, lobby: this.props.roomName, number: 8})
        }else{
            this.props.updateXP({uid: this.props.userID, lobby: this.props.roomName, number: 8})
        } 
    }

    
}
handleAnswerMCCorrect=(isAnswered, questionN, answeredOnce)=>{
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if(!isAnswered){
        let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
        //make changes
        questionsCopy[questionN].answered = true
        questionsCopy[questionN].answeredOnce ++
        questionsCopy[questionN].isCorrect = true
        this.setState({
           questions:questionsCopy 
         }) 
    }
    //only award xp if answered once is false
    if(answeredOnce === 0){
        //give a present if the user levels up
        if(exact_level(this.props.userxp) !== exact_level(this.props.userxp+8)){
            this.props.givePresent({uid: this.props.userID})
            this.props.updateXP({uid: this.props.userID, lobby: this.props.roomName, number: 8})
        }else{
            this.props.updateXP({uid: this.props.userID, lobby: this.props.roomName, number: 8})
        } 
        //give a token to the creator if not self
        if (this.state.questions[questionN].authorID !== this.props.userID){
            this.props.giveTokens({userID: this.state.questions[questionN].authorID, amount: 1, lobby:this.props.roomName})
        }
    }
}
handleAnswerMCIncorrect=(isAnswered, questionN, hisAnswer)=>{
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if(!isAnswered){
        let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
        //make changes
        questionsCopy[questionN].answered = true
        questionsCopy[questionN].isCorrect = false
        questionsCopy[questionN].userAnswer = hisAnswer
        this.setState({
           questions:questionsCopy 
         }) 
    }
}
handleChange = (e) =>{
    this.setState({
        [e.target.id]: e.target.value
    })
}
starQuestion = (questionN, roomName, unitID, questionID) =>{
    //change it locally
    let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
    //make changes
    questionsCopy[questionN].stars = {...questionsCopy[questionN].stars, ...this.props.userID}
    questionsCopy[questionN].stars[this.props.userID] = {id: this.props.userID}
    this.setState({
       questions:questionsCopy 
     }) 
    //call to serve
    this.props.starQuestion({lobby: roomName, unitID: unitID, questionID})
}
unStarQuestion = (questionN, roomName, unitID, questionID)=>{
    //change it locally
    let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
    //make changes
    questionsCopy[questionN].stars[this.props.userID] = null
    this.setState({
       questions:questionsCopy 
     }) 
     //call to serve
    this.props.unStarQuestion({lobby: roomName, unitID: unitID, questionID})
}
componentDidMount(){
    var questionsArray = [];
    this.props.addPlayToUnit({lobby: this.props.roomName, unitID: this.props.unitID})
    this.props.questions && Object.entries(this.props.questions).map(data=>{
        const mcArray = this.shuffleArray([data[1].answer, data[1].option2, data[1].option3, data[1].option4]);
        //check for star mode
        if(this.props.starMode){
            if(data[1].stars && data[1].stars[this.props.userID]){
                questionsArray.push({...data[1], id: data[0], mcArray, answered: false, answeredOnce: 0})
            }
        }else{   
            questionsArray.push({...data[1], id: data[0], mcArray, answered: false, answeredOnce: 0})
        }
        return this.setState({questions: questionsArray, questionsLength: questionsArray.length})   
    })
}
render(){
return(
<div className="white-text" stlye={{position: "relative", zIndex: "99"}}>
<div style={{ marginTop: "-90px",float:"left", clear: "both" }} ref={(el) => { this.messagesStart = el; }}></div>
    <p style={{cursor: "pointer"}}onClick={this.props.backToQuestions} className="white-text">{"< Back To Questions"}</p>
    <div className="play-row">
    <div className="play-row-button" onClick={this.shuffleQuestions}>
        <i className="material-icons" >shuffle</i>
        Shuffle
    </div>
    <div className="play-row-button" onClick={()=>{this.setState({questions: this.resetAllQuestions(this.state.questions)})}}>
        <i className="material-icons" >replay</i>
        Reset
    </div>
    <div className="play-row-button" onClick={this.prevQuestion}>
        <i className="material-icons" >chevron_left</i>
        Prev
    </div>
    
    <div className="play-row-button" onClick={this.nextQuestion}>
        <i className="material-icons"  >chevron_right</i>
        Next
    </div>
    <div className="play-row-button-block">
    </div>
    
    
    <div className="play-progress">
        <div className="play-progress-back">
            <div className="play-progress-progress" style={{width: (this.state.currentQuestion / this.state.questionsLength)*100+"%"}}></div>
        </div>
        <div className="play-progress-title">PROGRESS</div>
        <div className="play-progress-number">{this.state.currentQuestion+"/"+this.state.questionsLength}</div>
    </div>
    
    </div>
    <div className="play-wra">
   
    <div className="play-question" >
        <p className="set-star">
                <i onClick={()=>{
                    this.state.questions && 
                    this.state.questions[this.state.currentQuestion - 1] &&
                    this.state.questions[this.state.currentQuestion - 1].stars &&
                     this.state.questions[this.state.currentQuestion - 1].stars[this.props.userID]?
                     (this.unStarQuestion(this.state.currentQuestion - 1, this.props.roomName, this.props.unitID, this.state.questions[this.state.currentQuestion - 1].id)):(this.starQuestion(this.state.currentQuestion - 1, this.props.roomName, this.props.unitID, this.state.questions[this.state.currentQuestion - 1].id))
                    }}

                    className={this.state.questions && 
                        this.state.questions[this.state.currentQuestion - 1] &&
                    this.state.questions[this.state.currentQuestion - 1].stars &&
                     this.state.questions[this.state.currentQuestion - 1].stars[this.props.userID]?("material-icons yellow-text"):("material-icons")}>
                        {this.state.questions && 
                        this.state.questions[this.state.currentQuestion - 1].stars &&
                        this.state.questions[this.state.currentQuestion - 1].stars[this.props.userID]?("star"):("star_border")}
                </i>
        </p>
        <i onClick={this.handleResetQuestion} className="material-icons replay-icon">replay</i> 
        <h1>
            {this.state.questions && this.state.questions[this.state.currentQuestion - 1].question}
 
        </h1>
        {
            this.state.questions && this.state.questions[this.state.currentQuestion - 1].questionPicture &&
            <img src={this.state.questions[this.state.currentQuestion - 1].questionPicture} alt={this.state.questions[this.state.currentQuestion - 1].questionPicture}/>
        }
    </div>
    <div className="play-user-answer-wrapper">
    {
        //show the user's original answer
        this.state.questions && this.state.questions[this.state.currentQuestion - 1].answered && this.state.questions[this.state.currentQuestion - 1].type !== "fc" ? (
            this.state.questions[this.state.currentQuestion - 1].isCorrect?(
                <div className="play-user-answer green"><p>{this.state.questions[this.state.currentQuestion - 1].answeredOnce !== 1 ?("Correct"):("Correct +8xp")}</p> </div>
            ):(
                <div className="play-user-answer red darken-3" > <p>Incorrect (Your answer: {this.state.questions[this.state.currentQuestion - 1].userAnswer})</p> </div>
            )
        ):(null)
    }
   </div>
    <div className="play-answer">
    <div className="mc-row ">
        {
            this.state.questions && this.state.questions[this.state.currentQuestion - 1].type === "mc" 
            && this.state.questions[this.state.currentQuestion - 1].mcArray.map(data=>{
                return(<div
                key={data.id}
                onClick={()=>{
                    this.state.questions[this.state.currentQuestion - 1].answer === data?
                    (this.handleAnswerMCCorrect(this.state.questions[this.state.currentQuestion - 1].answered, (this.state.currentQuestion - 1), this.state.questions[this.state.currentQuestion - 1].answeredOnce)):
                    (this.handleAnswerMCIncorrect(this.state.questions[this.state.currentQuestion - 1].answered, (this.state.currentQuestion - 1), data))
                }
                    }
                className={this.state.questions[this.state.currentQuestion - 1].answered ?
                        (
                        //user answered the question
                        this.state.questions[this.state.currentQuestion - 1].answer === data?
                        ("mc-question green"):("mc-question grey darken-4 grey-text text-darken-3")
                        ):(
                        //user has not answered the question
                        "mc-question"
                        )
                    
                }>{data}</div>)
            })
        }
        {
            this.state.questions && this.state.questions[this.state.currentQuestion - 1].type === "fc" ? (
                    this.state.questions[this.state.currentQuestion - 1].answered?(
                        <div className="center show-answer-fc">
                        <h1>{this.state.questions[this.state.currentQuestion - 1].answer}</h1>
                        <img src={this.state.questions[this.state.currentQuestion - 1].answerPicture} alt={this.state.questions[this.state.currentQuestion - 1].answerPicture}/>
                        </div>
                    ):(
                        <div className="center show-button">
                        <button onClick={()=>{this.handleShowFC(this.state.currentQuestion - 1)}} className="btn grey darken-2">Show Answer</button>
                        </div>
                    )   ):(null)
        }
        {
            this.state.questions && this.state.questions[this.state.currentQuestion - 1].type === "sa" ? (
                <div className="center show-answer-fc">
                <form id="saForm" onSubmit={(e)=>{this.handleSA(e, this.state.questions[this.state.currentQuestion - 1].answered, this.state.saanswer === this.state.questions[this.state.currentQuestion - 1].answer, (this.state.currentQuestion - 1), this.state.questions[this.state.currentQuestion - 1].answeredOnce)}}>
                <div className="row">
                <div className="input-field col s12 m6 center">
                    <input className="white-text" id="saanswer" type="text" onChange={this.handleChange}/>
                    <label htmlFor="saanswer">Answer</label>
                    <button style={{marginTop: "10px"}}className="btn grey darken-3">Submit</button>
                </div>
                <div className="input-field col s12 m6 center">
                    <div className="sa-answer center">
                        {
                            this.state.questions && !this.state.questions[this.state.currentQuestion - 1].answered && 
                            <div className={"sa-show-answer"}>
                                <button onClick={()=>{this.setState({saanswer: "Did Not Answer"}); this.handleSA(null, this.state.questions[this.state.currentQuestion - 1].answered, this.state.saanswer === this.state.questions[this.state.currentQuestion - 1].answer, (this.state.currentQuestion - 1), this.state.questions[this.state.currentQuestion - 1].answeredOnce )}} className="btn  grey darken-3">Show Answer</button>
                            </div>
                        }
                        <h1>Answer:</h1>
                        <p>{ this.state.questions && this.state.questions[this.state.currentQuestion - 1].answer}</p>
                    </div>
                </div>
                </div>
                
                </form>
                </div>
            ):(null)

        }
    </div>  {
        //next question
        this.state.questions && this.state.questions[this.state.currentQuestion - 1].answered ? (
            <div onClick={this.nextQuestion} className="play-next-question">
                Next Question >
            </div>
        ):(null)
    }
    </div>
    {
        //Scroll to the bottom view
    }
    <div style={{ marginTop: "80px", float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
    </div>
    
</div>
)
}
} 

const mapDispatchToProps=(dispatch)=>{
    return{
        starQuestion: (data)=>{dispatch(starQuestion(data))},
        unStarQuestion: (data)=>{dispatch(unStarQuestion(data))},
        updateXP: (data)=>{dispatch(updateXp(data))},
        givePresent: (data)=>{dispatch(givePresent(data))},
        giveTokens: (data)=>{dispatch(giveTokens(data))},
        addPlayToUnit: (data)=>{dispatch(addPlayToUnit(data))}
    }
}
export default compose(
    connect(null, mapDispatchToProps),   
)(Play)