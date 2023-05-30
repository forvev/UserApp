import styles from "./styles.module.css"
import { useState } from 'react';
import axios from 'axios';
import Users from './Users'
import User from "./User";


const Main=()=>{
    const [dane, ustawDane] = useState([])
    const [myNumber, setMyNumber] = useState() // 1 - it will fetch name and surname. 2 - it will fetch all of the details

    const handleGetUsers = async (e) => { 
        e.preventDefault()
        ustawDane([]);

        setMyNumber(1) //set number 1 if we need all of the users
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
        } catch (error) {
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
        const token = localStorage.getItem("token")

        if (token) {
            try {
            //konfiguracja zapytania asynchronicznego z tokenem w nagłówku: 
            const config = {
                method: 'get',
                url: 'http://localhost:8080/api/users/first',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token }
            }
            //wysłanie żądania o dane:
            const { data: res } = await axios(config)
            //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
            //z serwera – jeśli został poprawnie zweryfikowany token
            console.log(res.data)
            ustawDane([res.data]) // `res.data` - zawiera sparsowane dane – listę
            //console.log("data2:",dane)
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

    const handleLogout = () => {
        localStorage.removeItem("token") 
        window.location.reload()
    } 
    return (
        <div className={styles.main_container}> 
            <nav className={styles.navbar}>
                {/* <h1>MySite</h1> */}
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
            {dane.length>0 ? <Users users={dane} number={myNumber}/> : <p>empty</p>}
        </div>     
    )
}

export default Main

