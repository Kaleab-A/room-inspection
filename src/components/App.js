import React from 'react';
import Signup from './Signup';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import './style.css';

function App() {
	// FIXME - Play with and Fix the router issue
	// TODO - Think of a way to convert this to Android App
	return (
		<Container
			className="d-flex justify-content-center"
			style={{ minHeight: '100vh' }}
		>
			<div className="w-100">
				<Router>
					<AuthProvider>
						<Routes>
							<Route exact path="/" element={<Login />} />
							<Route
								path="/update-profile"
								element={<UpdateProfile />}
							/>
							<Route path="/signup" element={<Signup />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
						</Routes>
					</AuthProvider>
				</Router>
			</div>
		</Container>
	);
}

export default App;
