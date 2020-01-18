import React from "react";

export const DuplicatLobbyRed = () =>{
    return(
        <div className="DuplicatLobbyRed">
            <i className="material-icons red-text red-arrow" style={{marginLeft: "20px"}}>arrow_upward</i>
            <h1 className="center">Whoops</h1>
            <p className="center">It Looks like you have a lobby tab already open.</p>
        </div>
    )
}