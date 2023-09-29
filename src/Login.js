import React from 'react';
import {  Container, Paper, Typography, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import { message } from 'antd'; 
const theme = createTheme();

const styles = {
  container: {
    backgroundImage: "url('https://i.pinimg.com/564x/13/4a/b1/134ab11070f935f5f03cd9202f36da0d.jpg')",
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth:'100vw'
  },
  paper: {
    padding: "5vh",
    display: 'flex',
    flexDirection: 'column',
    //backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '30%',
    borderRadius: "5vh",
    background:"transparent",
    boxShadow: "8px 8px 8px rgba(0, 0, 0, 0.2), -8px -8px 8px rgba(0, 0, 0, 0.2), -8px 8px 8px rgba(0, 0, 0, 0.2)",
  },
    logo: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '1rem',
        width: '18vh', 
      height: '18vh',
    
    },
    otpContainer: {
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: "5vh",
    height: "25vh",
      width: "100%",
    maxWidth:"400px"
  },
  underscore: {
    fontSize: '1.5rem',
    letterSpacing: '1rem',
      fontWeight: 'light',
    marginBottom: '1rem',
    },
  otpField: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
    underscoreClickable: {
    textDecoration: 'underline',
      cursor: 'pointer',
    borderBottom:'none'
  },
  otpDigit: {
    fontSize: '2rem',
    fontWeight: 'light',
    marginRight: '1rem',
  },
};

function Login() {
  const navigate = useNavigate();
  const [showOTPField, setShowOTPField] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [email, setEmail] = useState('');
  const [requestingOTP, setRequestingOTP] = useState(false); // Added state to track OTP request status
  const [sessionId, setSessionId] = useState(null);
  
  const handleEmailChange = (newValue) => {
    setEmail(newValue);
    setIsEmailValid(validateEmail(newValue));
  };



const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };


  const handleRequestOTP = () => {
    if (!isEmailValid || email.trim() === '' || requestingOTP) {
      // Disable the button if requestingOTP is true or other conditions are not met
      return;
    }

    setRequestingOTP(true); // Set requestingOTP to true while making the request

    // Make an API request to request OTP
    axios
      .post(`https://api.p360.build:9003/v1/user/authenticateUser/${email}`)
      .then((response) => {
        setShowOTPField(true);
        // const { sessionId } = response.data.data;
        console.log("response", response.data.sessionId);
        setSessionId(response.data.sessionId);
      })
      .catch((error) => {
        console.error('Error requesting OTP:', error);
        // message.error('An error occurred while submitting OTP. Please try again.');
        message.error('Please enter Valid Username');
      })
      .finally(() => {
        setRequestingOTP(false); // Set requestingOTP back to false
      });
  };

  const handleOTPSubmit = () => {
    console.log("Session : ", sessionId);
    console.log("Submitted called");
    // Make an API request to submit OTP
    const otpData = {
      session:sessionId,
      email:email,
      confirmationCode: enteredOTP,
    };
    
    axios
      .post('https://api.p360.build:9003/v1/user/respondToAuthChallenge', otpData)
      .then((response) => {
        console.log("Submitted OK")
        message.success('You logged in successfully');
        localStorage.setItem("accessToken", response.data.accessToken);
         localStorage.setItem("idToken",response.data.idToken);
        console.log(response.data);
        navigate('/Home');
      })
      .catch((error) => {
        console.log("Submitted Fail")
        console.error('Error submitting OTP:', error.response);
        message.error('An error occurred while submitting OTP. Please try again.');
        setEnteredOTP('');
      });
  };


  
  const handleOTPChange = (newValue) => {
    // Only allow numeric characters and limit to 4 characters
    const sanitizedValue = newValue.replace(/[^0-9]/g, '').slice(0, 6);
    setEnteredOTP(sanitizedValue);
  };

  // Generate underscore placeholders based on enteredOTP
  const underscorePlaceholders = '_ '.repeat(6 - enteredOTP.length).trim();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={styles.container}>
        <Paper elevation={3} sx={styles.paper} >
          <img
            alt="Logo"
            src="https://static.wixstatic.com/media/63938a_4a81d6cf9afe4464be4e6f5807c13c4f~mv2.png/v1/fill/w_2500,h_2500,al_c/63938a_4a81d6cf9afe4464be4e6f5807c13c4f~mv2.png"
            style={styles.logo}
          />
         {!showOTPField && (
  <>
    <Typography
      component="h1"
      variant="h5"
                
      style={{ fontFamily: 'OpenSans', marginLeft: "4%" }}
    >
      <b>Login</b>
    </Typography>
   <TextField
  margin="normal"
  label="Username"
   value={email}             
  fullWidth
  autoFocus
  variant="standard"
 // autoComplete='off'
  style={{ width: '90%', marginLeft: "4%" }}
  onChange={(e) => {
    const username = e.target.value;
    setIsUsernameEmpty(username === ''); // Check for empty username
    handleEmailChange(username);
  }}
  error={!isEmailValid || isUsernameEmpty}
  helperText={
    !isEmailValid
      ? "Please enter a valid email"
      : isUsernameEmpty
      ? "Please enter username"
      : ""
  }
/>

    <Button
      fullWidth
      variant="contained"
      color="primary"
      sx={{ marginTop: 2, marginBottom: 1 }}
      style={{ width: '90%', marginLeft: "4%" }}
      onClick={handleRequestOTP}
      disabled={!isEmailValid || isUsernameEmpty}
    >
      Request OTP
    </Button>
  </>
)}
{showOTPField && (
            <div style={styles.otpContainer}>
              <Typography variant="body1" gutterBottom>
                Please enter OTP:
              </Typography>
              <div style={styles.otpField}>
                {enteredOTP.split('').map((digit, index) => (
                  <Typography
                    key={index}
                    variant="h6"
                    component="span"
                    style={styles.otpDigit}
                  >
                    {digit}
                  </Typography>
                ))}
              </div>
              <div // Wrap the underscore with a div and add onClick event
                style={{...styles.underscoreClickable,textDecoration: 'none'}}
                onClick={() => {
                  // Programmatically focus the hidden input field
                  const hiddenInput = document.getElementById('otpInput');
                  if (hiddenInput) {
                    hiddenInput.focus();
                  }
                }}
              >
                <Typography variant="h6" component="span" style={styles.underscore}>
                  {underscorePlaceholders}
                </Typography>
              </div>
              <input
                id="otpInput" // Add an id to the input field
               // type="tel"
                maxLength="6"
                style={{ width: '0', height: '0', opacity: 0, position: 'absolute' }}
                autoFocus
                onChange={(e) => handleOTPChange(e.target.value)}
                value={enteredOTP}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: 2, marginBottom: 1 }}
                style={{ width: '100%', maxWidth: '200px' }}
                onClick={handleOTPSubmit}
                disabled={enteredOTP.length !== 6}
              >
                Log In
              </Button>
            </div>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}


export default Login;