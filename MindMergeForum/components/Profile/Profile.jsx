import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../src/store/app.context';
import { updateUser } from '../../services/user.services';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { userData, setAppState } = useContext(AppContext);
  const [state, setState] = useState({
    isEditing: false,
    firstName: '',
    lastName: '',
    phone: '',
    loading: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setState({
        isEditing: false,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        loading: false,
      });
    }
  }, [userData]);

  const handleEdit = () => {
    setState((prevState) => ({ ...prevState, isEditing: true }));
  };

  const handleSave = async () => {
    try {
      if (!userData || !userData.uid) {
        throw new Error('User data is not available');
      }
      if (state.firstName.length < 4 || state.firstName.length > 32) {
        return alert('First name must be between 4 and 32 characters');
      }
      if (state.lastName.length < 4 || state.lastName.length > 32) {
        return alert('Last name must be between 4 and 32 characters');
      }
      if (isNaN(state.phone)) {
        return alert('Please enter a valid phone number');
      }

      await updateUser(userData.handle, {
        firstName: state.firstName,
        lastName: state.lastName,
        phone: state.phone,
      });

      setAppState((prevState) => ({
        ...prevState,
        userData: {
          ...prevState.userData,
          firstName: state.firstName,
          lastName: state.lastName,
          phone: state.phone,
        },
      }));
      setState((prevState) => ({ ...prevState, isEditing: false }));
    } catch (error) {
      alert(`Error updating profile: ${error.message}`);
    }
  };

  const handleChangePassword = () =>{
    navigate("/password-change")
  }

  const handleCancel = () => {
    setState({
      isEditing: false,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      loading: false,
    });
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h2>Profile</h2>
      {state.isEditing ? (
        <>
          <p>
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              value={state.firstName}
              onChange={(e) => setState({ ...state, firstName: e.target.value })}
            />
          </p>
          <p>
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              value={state.lastName}
              onChange={(e) => setState({ ...state, lastName: e.target.value })}
            />
          </p>
          <p>
            <label htmlFor="phone">Phone Number:</label>
            <input
              id="phone"
              type="text"
              value={state.phone}
              onChange={(e) => setState({ ...state, phone: e.target.value })}
            />
          </p>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <p>Username: {userData.handle}</p>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Email: {userData.email}</p>
          <p>Phone Number: {userData.phone}</p>
          <p>Current role: {userData.role}</p>
          <button onClick={handleEdit} style={{marginRight: `10px`}}>Edit</button>
          <button onClick = {handleChangePassword}>Change Password</button>
        </>
      )}
    </div>
  );
}