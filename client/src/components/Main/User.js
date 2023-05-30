const User = (props) => {
    const user = props.user;

    if (props.number === 1){
        console.log("I am in the 1st part")
        return ( <li> {user.firstName} {user.lastName} </li> ); 
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
    