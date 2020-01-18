const initState = {
    duplicateAmount: null
}
const giftBoxReducer = (state = initState, action) =>{
    switch (action.type){
        case "DUPLICATE_SUCCESS":
            return {
                ...state,
                duplicateAmount: action.duplicateAmount
            }
        default: 
            return state;
    }
}
export default giftBoxReducer