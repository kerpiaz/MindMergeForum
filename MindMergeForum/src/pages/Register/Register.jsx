import { AppContext } from "../../store/app.context";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/auth.services";
import { createUserHandle, getUserByHandle } from "../../../services/user.services";
import { Roles } from "../../../common/roles.enum";

export default function Register() {

    const { setAppState } = useContext(AppContext)

    //state only for this specific component! It is not our context!
    const [user, setUser] = useState({
        handle: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role:Roles.user,
        phone: '',
    });

    const navigate = useNavigate();

    const register = () => {

        if (!user.email || !user.password ||!user.firstName||!user.lastName) {
            return alert('Please fill in all fields')
        }

        if(user.firstName.length<4 || user.firstName.length>32){
            return alert('Your first name must be between 4 and 32 characters')
        }

        if(user.lastName.length<4 || user.lastName.length>32){
            return alert('Your last name must be between 4 and 32 characters')
        }
        
        getUserByHandle(user.handle)
        .then(userFromDb=>{
            if(userFromDb){
                throw new Error(`User with username "${user.handle} already exists"`)
            }

            return registerUser(user.email, user.password)
        })
        .then(userCredential=>{
            return createUserHandle(user.handle, userCredential.user.uid, user.email, user.firstName, user.lastName, user.phone, user.role)
            .then(()=>{
                setAppState({
                    user: userCredential.user,
                    userData: null,
                });
                navigate('/')
            })
        })
        .catch((error)=>console.error(error.message))
    }

    const updateUser = (prop) => (e) => {
        setUser({
            ...user,
            [prop]: e.target.value
        })
    }

    return (
        <div>
            <h3>Register</h3>
            <div>
                <label htmlFor="firstName">First Name: </label>
                <input value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" />
                <br /><br />
                <label htmlFor="lastName">Last Name: </label>
                <input value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" />
                <br /><br />
                <label htmlFor="handle">Username: </label>
                <input value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" />
                <br /><br />
                <label htmlFor="phone">Phone (optional): </label>
                <input value={user.phone} onChange={updateUser('phone')} type="text" name="phone" id="phone" />
                <br /><br />
                <label htmlFor="email">Email: </label>
                <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" />
                <br /><br />
                <label htmlFor="password">Password: </label>
                <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" />
                <br /><br />
                <button onClick={register} >Register</button>
            </div>
        </div>
    )
}