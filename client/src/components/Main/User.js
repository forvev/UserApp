import axios from 'axios';
// const bcrypt = require("bcrypt")
import { useJwt } from "react-jwt";
const token = process.env.JWTPRIVATEKEY;



const User = (props) => {
    const user = props.user;
    const token = localStorage.getItem("token")
    const { decodedToken, isExpired } = useJwt(token);

    console.log("dec: ", decodedToken)

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

            await axios(config)
        } catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        } 
    }

    if (token) {
        try {
        //konfiguracja zapytania asynchronicznego z tokenem w nagłówku: 
        const config = {
            method: 'get',
            url: 'http://localhost:8080/api/users/addFriend',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token, 'user_to_add': props.value}
        }

        const { data: res } = axios(config)
    } catch (error) {
        if (error.response && error.response.status >= 400 &&error.response.status <= 500)
        {
            localStorage.removeItem("token") 
            window.location.reload()
        } 
    }
    } 

    if (props.number === 1){
        
        // const chack =  main_user.find({_id: main_user._id, "friends._id": { $in: [user._id]}})
        // console.log("hey: ",chack);
        console.log("I am in the 1st part")
        return ( 
            <nav>
                <li> {user.firstName} {user.lastName} </li>
                <button onClick={addFriendClick}>Add to friends</button>
            </nav>
        ); 
    }else{
        console.log("I am in the 2st part")
        return ( 
            <div>
                <b>Account details</b>
                <p>name and surname: {user.firstName} {user.lastName}</p>
                <p>email: {user.email}</p>
                <p>id: {props.value}</p>
            </div>
            
        ); 
    }

}  


export default User
    