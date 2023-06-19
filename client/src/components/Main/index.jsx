import styles from "./styles.module.css"
import { useState } from 'react';
import axios from 'axios';
import Users from './Users'
import User from "./User";


const Main=()=>{
    const [dane, ustawDane] = useState([])
    const [myNumber, setMyNumber] = useState() // 1 - it will fetch name and surname. 2 - it will fetch all of the details

    const [showUsers, setShowUsers] = useState(false); // State variable for Users button click
    const [showUserDetails, setShowUserDetails] = useState(false); // State variable for User details button click
    const [showFirends, setShowFriends] = useState([])

    const handleGetUsers = async (e) => { 
        e.preventDefault()
        ustawDane([]);

        setMyNumber(1) //set number 1 if we need all of the users
        setShowUsers(true)
        setShowUserDetails(false)
        setShowFriends(false)
        //pobierz token z localStorage:
        const token = localStorage.getItem("token")
        //jeśli jest token w localStorage to: 
        if (token) {
            try {
            //konfiguracja zapytania asynchronicznego z tokenem w nagłówku: 
            const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            //wysłanie żądania o dane:
            const { data: res } = await axios(config)
            //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
            //z serwera – jeśli został poprawnie zweryfikowany token
            console.log(res.data)
            ustawDane(res.data) // `res.data` - zawiera sparsowane dane – listę
            console.log("data1", dane)
        } 
        catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        } 
    }

    const displayDetails = async (e) =>{
        e.preventDefault()
        ustawDane([]);

        setMyNumber(2) //set number 2 if we need only one user (the signed in one)
        setShowUserDetails(true)
        setShowUsers(false)
        setShowFriends(false)
        const token = localStorage.getItem("token")

        if (token) {
            try {
            const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users/first',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            const { data: res } = await axios(config)
            console.log("details: ",res.data)
            ustawDane([res.data]) // `res.data` - zawiera sparsowane dane – listę
        } catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        } 
    }

    const deleteAccount = async (e) =>{
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (token) {
            try {
            const confirmed = window.confirm("Are you sure you want to delete your account?");
            if(confirmed){
                const config = {
                    method: 'delete',
                    url: 'http://localhost:8080/api/users/delete',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                }
                const { data: res } = await axios(config)
                window.location.href = "/login";
            }
        } catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        }
    }

    const showFriends = async (e) =>{
        e.preventDefault()
        setMyNumber(3)

        setShowUserDetails(false)
        setShowUsers(false)
        setShowFriends(true)
        const token = localStorage.getItem("token")
        
        if (token) {
            try {
            const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users/showFriends',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            const { data: res } = await axios(config)
            ustawDane(res.data) // `res.data` - zawiera sparsowane dane – listę

        } catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        } 
    }

    const removeFriend = async (friendToRemove) =>{

        const token = localStorage.getItem("token")
        console.log("friend to remove:", friendToRemove._id);
        if (token) {
            try {
            const config = {
                method: 'delete',
                url: 'http://localhost:8080/api/users/removeFriend',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token, 'friend_id': friendToRemove._id }
            }
            const { data: res } = await axios(config)
            //ustawDane(res.data) // `res.data` - zawiera sparsowane dane – listę

        } catch (error) {
            if (error.response && error.response.status >= 400 &&error.response.status <= 500)
            {
                localStorage.removeItem("token") 
                window.location.reload()
            } 
        }
        }

        window.location.reload()
    }


    const handleLogout = () => {
        localStorage.removeItem("token") 
        window.location.reload()
    } 
    return (
        <div>
            <div className={styles.main_container}> 

                <nav className={styles.navbar}>
                    <button className={styles.white_btn} onClick={handleLogout}> Logout </button>
                </nav> 
                <nav className={styles.navbar}>
                    <button className={styles.white_btn} onClick={handleGetUsers}>Users</button>
                </nav>
                <nav className={styles.navbar}>
                    <button className={styles.white_btn} onClick={displayDetails}>User details</button>
                </nav>
                <nav className={styles.navbar}>
                    <button className={styles.white_btn} onClick={deleteAccount}>Delete account</button>
                </nav>
                <nav className={styles.navbar}>
                    <button className={styles.white_btn} onClick={showFriends}>Show friends</button>
                </nav>
            </div>
            <div>
                {(showUsers || showUserDetails) && (dane.length>0 ? <Users users={dane} number={myNumber}/> : <p>empty</p>)}
                {showFirends && (dane.length>0 ? 
                                            <div className="user-table">
                                                <ul>
                                                    {dane.map((item) => (
                                                        <div>
                                                            <button onClick={() => removeFriend(item)}>remove</button>
                                                            <li key={item._id}>{item.username}</li>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                            : 
                                            <p>empty</p>)}

            </div>     
         </div>
    )
}

export default Main

