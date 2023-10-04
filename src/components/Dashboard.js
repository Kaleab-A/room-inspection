import React, {useState} from 'react'
import {Button, Card, Alert} from "react-bootstrap"
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import RoomList from './RoomList'
import HallList from './HallList'

export default function Dashboard() {
    const [error, setError] = useState("")
    const {currentUser, logout} = useAuth()
    const navigate = useNavigate()

    async function handleLogout(){
        setError("")
        try{
            navigate("/")
            await logout()
        } catch(e) {
            setError("Failed to Logout")
            console.log(e)
        }
    } 

  return (
    <div style={{marginTop: "7%"}}>
      {/* <RoomList name1="kaleab" name2="youssef"/>
      <RoomList name1="asdas" name2="asdas"/>
      <RoomList name1="Amine" name2="Migel"/> */}
      <HallList/>

      {/* <Card >
        <Card.Body> 
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <br></br>
          <strong>School:</strong> {currentUser.school}
          <br/>
          <strong>Good At:</strong> {currentUser.goodAt}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card> */}
      {/* <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div> */}
    </div>
  )
}
