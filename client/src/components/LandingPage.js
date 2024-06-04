// LandingPage.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function LandingPage({ setAuthenticated }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const history = useHistory();
  const whitelistNumbers = ['9315614507', '7007128936', '8052982826', '8826586858'];

  const handleInputChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make an API call to verify the mobile number
    try {
      const valid = whitelistNumbers.includes(mobileNumber);
      if (valid) {
        setAuthenticated(true);
        history.push('/main');
      } else {
        alert('Invalid mobile number');
      }
    } catch (error) {
      console.error('Error verifying mobile number:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Dairyfy</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={mobileNumber} 
          onChange={handleInputChange} 
          placeholder="Enter your mobile number" 
          required 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LandingPage;
