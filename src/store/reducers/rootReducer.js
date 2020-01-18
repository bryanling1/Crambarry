import {combineReducers} from "redux";
import authReducer from "./authReducer";
import {firestoreReducer} from "redux-firestore";
import {firebaseReducer} from "react-redux-firebase";
import chatReducer from "./chatReducer";
import adminReducer from "./adminReducer"
import dashboardReducer from "./dashboardReducer"

const rootReducer = combineReducers({
    auth: authReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    chat: chatReducer,
    admin: adminReducer,
    dash: dashboardReducer
});
export default rootReducer