import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { auth } from "../../src/config/firebase.config";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import './PasswordChange.css';

export default function PasswordChange(){
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

 /**
 * Auto-dismisses notifications and redirects on success
 * 
 * @effect Hides notification after 3s and navigates to profile on success
 */
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
                if (notification.type === 'success') {
                    navigate('/user-profile');
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.show, notification.type, navigate]);

 /**
 * Displays a notification with specified message and type
 * 
 * @param {string} message - Text to display in notification
 * @param {string} type - Notification type ('success' or 'error')
 */
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
    };

    /**
 * Validates and processes password change request
 * 
 * Performs validation checks, reauthenticates user, and updates password
 * Shows appropriate notifications for success or errors
 */
    const handleChangePassword = async () => {
        if(currentPassword === newPassword){
            showNotification('The new password must not match the previous password', 'error');
            return;
        }
        if(newPassword === ''){
            showNotification('Please fill in the new password field', 'error');
            return;
        }
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            showNotification('Password updated successfully!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

/**
 * Navigates back to user profile page
 */
    const handleCancel = () => {
        navigate('/user-profile');
    }

/**
 * Toggles visibility of current password field
 */
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    }

/**
 * Toggles visibility of new password field
 */
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    }

    return(
        <div className="password-change-container">
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? '✓' : '⚠️'} {notification.message}
                </div>
            )}
            <div className="password-card">
                <h2 className="password-title">Change Password</h2>
                
                <div className="form-group">
                    <label htmlFor="current-pass" className="form-label">
                        Current Password <span className="required-marker">*</span>
                    </label>
                    <div className="password-input-wrapper">
                        <input 
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            id="current-pass"
                            className={`password-input ${error && error.includes('current') ? 'error' : ''}`}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            className="toggle-password"
                            onClick={toggleCurrentPasswordVisibility}
                            aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                        >
                            {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="new-pass" className="form-label">
                        New Password <span className="required-marker">*</span>
                    </label>
                    <div className="password-input-wrapper">
                        <input 
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            id="new-pass"
                            className={`password-input ${error && error.includes('new') ? 'error' : ''}`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            className="toggle-password"
                            onClick={toggleNewPasswordVisibility}
                            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        >
                            {showNewPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn-submit" onClick={handleChangePassword}>
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}