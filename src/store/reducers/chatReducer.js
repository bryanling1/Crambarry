const initState = {
    chatFail: null
}
const chatReducer = (state = initState, action) =>{
    switch (action.type){
        case "CHAT_SUCCESS":
            return state;
        default: 
            return state;
    }
}
export default chatReducer