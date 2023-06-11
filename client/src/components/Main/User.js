import axios from 'axios';

const User = (props) => {
    const user = props.user;

    const addFriendClick = async (e) =>{
        console.log("name: ", user.firstName)

        const token = localStorage.getItem("token")
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

    if (props.number === 1){
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
    