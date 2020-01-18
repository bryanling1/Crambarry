const initState = {
    authFail: null
}
const authReducer = (state = initState, action) =>{
switch (action.type){
    case "LOGIN_SUCCESS":
    return {
        ...state,
        authFail: null
    }
    case "LOGIN_FAILURE":
        return {
            ...state,
            authFail: "Wrong Email/Password Combo"
        }
    case "SIGNUP_SUCCESS":
    return {
        ...state,
        authFail: null
    }
    case "SIGNUP_FAILURE":
        return {
            ...state,
            authFail: action.err.message
        }
    case "SIGNOUT":
        return {
            ...state,
            authFail: null
        }
      case "SIGNOUT_ERROR":
        return {
            ...state,
            authFail: action.err.message
        }
    default:
        return state;
    }
}

export default authReducer;