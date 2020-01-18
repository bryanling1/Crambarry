const initState = {
    addlobby: null
}
const dashboardReducer = (state=initState, action) =>{
switch(action.type){
    case "ADD_LOBBY_SUCCESS":
        return state
    case "ADD_LOBBY_ERROR":
        return {
            ...state,
            addlobby: "Bad Code"
        }
    default:
        return state
}
}
export default dashboardReducer