import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { auth } from "../../src/config/firebase.config";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export default function PasswordChange(){

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = async()=>{
     if(currentPassword === newPassword){
        setError('The new password must not match the previous password');
        return;
     }
     if(newPassword === ''){
        setError('Please fill in the new password field')
        return;
     }
     try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
        await reauthenticateWithCredential(user, credential)
        await updatePassword(user, newPassword);
        alert('Password updated successfully!')
        navigate('/user-profile')
        
     } catch (error) {
        setError(error.message)
     }
    }

    const handleCancel=()=>{
        navigate('/user-profile')
    }

    return(
        <div>
            <h2>Change Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label htmlFor='current-pass'>Old Password: </label>
            <input 
            type='password' 
            placeholder='Current password' 
            id='current-pass'
            value = {currentPassword}
            onChange={(e)=> setCurrentPassword(e.target.value)}
            required
            />
            <br/><br/>
            <label htmlFor='new-pass'>New Password: </label>
            <input 
            type='password' 
            placeholder='New password' 
            id='new-pass'
            value = {newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            />
            <br/><br/>
            <button onClick={handleChangePassword} style={{marginRight: '10px'}}>Change Password</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    )
}