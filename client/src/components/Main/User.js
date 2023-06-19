import axios from 'axios';
// const bcrypt = require("bcrypt")
import { useJwt } from "react-jwt";
import { useState } from 'react';
import styles from "./styles.module.css"
import { React } from "react";

const token = process.env.JWTPRIVATEKEY;

const User = (props) => {
    const user = props.user;
    const token = localStorage.getItem("token")
    const { decodedToken, isExpired } = useJwt(token);
    const [friendState, setFriendState] = useState([])


    const addFriendClick = async (e) =>{
        console.log("name: ", user.firstName)

        if (token) {
            try {
            //konfiguracja zapytania asynchronicznego z tokenem w nagłówku: 
            const config = {
                method: 'put',
                url: 'http://localhost:8080/api/users/addFriend',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token, 'user_to_add': props.value}
            }
            //const { data: res } = await axios(config)
            await axios(config)
        } catch (error) {
            console.log("erorr!", error)
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                console.log("erorr!", error)
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        } 
    }
    


    const isFriend = async (my_friend) => {
        if (token) {
            try {
            const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users/is_friend',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token, 'friend_id': my_friend._id}
            }

            await axios(config).then((response) =>{
                setFriendState(response.data.message)                
            })
            
        } catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                console.log("text: ", error)
                // localStorage.removeItem("token") 
                // window.location.reload()
            } 
        }
        } 

        // if(friendState==="false"){
        //     console.log("heyy")
        //     return myStyles.red_button
        // }
        // else{
        //     console.log("heyy2")
        //     return myStyles.white_button
        // }
    }

    const myStyles = {
        red_button:{
            color: "red",
            "pointer-events": "none",
        },
        white_button:{
            color: "black",
        }
    }
    isFriend(user)
    const buttonStyle = friendState === "false" ? myStyles.white_button : myStyles.red_button;


    if (props.number === 1){
        console.log("I am in the 1st part")
        return ( 
            <nav>
                <button 
                    style={buttonStyle} 
                    onClick={addFriendClick}
                    >Add to friends</button>
                <li> {user.firstName} {user.lastName} </li>
            </nav>
        ); 
    }else if (props.number === 2){
        console.log("I am in the 2st part", user.firstName)
        return ( 
            <div>
                <b>Account details</b>
                <p>name and surname: {user.firstName} {user.lastName}</p>
                <p>email: {user.email}</p>
                <p>id: {props.value}</p>
            </div>
            
        ); 
    }
    else if(props.number === 3){
        console.log("I am in the 3st part", user.firstName)
        return ( 
            <nav>
                <li>name: {user.firstName} id: {props.value}</li>
                <button>Send a message</button>
            </nav>
            
        ); 
    }

}  


export default User
    