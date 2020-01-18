const initState = {
    adminStatus: null,
    color: null
}
const adminReducer = (state = initState, action) =>{
    switch (action.type){
        case "ADD_ITEM_SUCCESS":
            return {
                ...state,
                adminStatus: "Item Added!",
                color: "green"
            }
        case "ADD_ITEM_FAIL":
        return {
            ...state,
            adminStatus: "Item Add Failed: "+action.err,
            color: "red"
        }
        default: 
            return state;
    }
}
export default adminReducer