import User from "./User" 
function Users(props) {
    
    const users = props.users; 
    const number = props.number;
    console.log("my number:",number)
    return (
    <ul> {users.map((user) => <User key={user._id} value={user._id} user={user} number={number}/> )} </ul> ); }
    
    
export default Users