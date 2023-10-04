import React, { useRef, useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Question from './Question';
import app, { db } from '../firebase';
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import { Prev } from 'react-bootstrap/esm/PageItem';

export default function Rubric({ personName, hallName, roomNumber }) {
	const roomScoreCollectionRef = collection(db, 'studentRoomScores');
	const [studentRoomScores, setstudentRoomScores] = useState([]);
	const [responseArray, setResponseArray] = useState([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	]);
	const [id, setId] = useState('');
	const [scoreOnDB, setScoreOnDB] = useState([]);
	const [totalScore, setTotalScore] = useState(0);
	const [isDBChanged, setIsDBChanged] = useState(false);

	const createUser = async () => {
		let currentDate = new Date();
		let initScore = [calculateScore()];
		let data = {
			studentName: personName,
			score: initScore,
			roomNumber: roomNumber,
			hallName: hallName,
			lastDateUpdated: currentDate,
		};

		let returnedResponse = await addDoc(roomScoreCollectionRef, data);
		setScoreOnDB(data.score);
		console.log(returnedResponse._key.path.segments[1]);
		setId(returnedResponse._key.path.segments[1]);
	};

	useEffect(() => {
		console.log('isEffect Running');
		const getUsers = async () => {
			const data = await getDocs(roomScoreCollectionRef);
			setstudentRoomScores(
				data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);

			studentRoomScores.map((a) => {
				if (a.studentName === personName) {
					setId(a.id);
					setScoreOnDB(a.score);
				}
			});
		};

		getUsers();
	}, [isDBChanged]);

	const updateUser = async (score) => {
		setIsDBChanged(!isDBChanged);
		console.log('From DB', scoreOnDB, id);
		let updatedScore = scoreOnDB;
		updatedScore.push(score);
		const userDoc = doc(db, 'studentRoomScores', id);
		const newFields = { score: updatedScore };
		await updateDoc(userDoc, newFields);
	};

	function calculateScore() {
		let scoreTemp =
			responseArray
				.slice(0, responseArray.length - 3)
				.reduce((partialSum, a) => partialSum + a, 0) -
			responseArray
				.slice(responseArray.length - 3, responseArray.length)
				.reduce((partialSum, a) => partialSum + a, 0);
		setTotalScore(scoreTemp);
		return scoreTemp;
	}

	function handleClick() {
		let isUserCreated = false;
		for (var ind = 0; ind < studentRoomScores.length; ind++) {
			var a = studentRoomScores[ind];
			if (a.studentName === personName) {
				console.log('User Already Created');
				isUserCreated = true;
				break;
			}
		}

		if (!isUserCreated) {
			createUser();
		} else {
			updateUser(calculateScore());
		}
		setIsDBChanged(!isDBChanged);
	}

	function sendDataToParentToParent(data) {
		setResponseArray(data);
		calculateScore();
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2>Score: {totalScore}</h2>
					<div className="mb-3">
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={0}
							responseArray={responseArray}
							maxPoint={2}
						>
							Clean Floor (Wiped, No clutter, Shoes, Bags neatly
							arranged under bed, no cables running across the
							floor)
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={1}
							responseArray={responseArray}
							maxPoint={4}
						>
							Beds neatly made (no pile of clothes or other items
							on the bed, linen changed, no extra linen in
							cupboard)
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={2}
							responseArray={responseArray}
							maxPoint={2}
						>
							Desk state (Booked neatly staked, no clutter, stains
							cleaned, check bedside locker)
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={3}
							responseArray={responseArray}
							maxPoint={4}
						>
							Empty Dust Bin
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={4}
							responseArray={responseArray}
							maxPoint={2}
						>
							Clothes lying around (State of folded clothes in
							wardrobe, clothes neatly piled)
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={5}
							responseArray={responseArray}
							maxPoint={3}
						>
							State of heater, windows (no dust, no hanging items
							to dry on window, , heater not covered)
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={6}
							responseArray={responseArray}
							maxPoint="100"
						>
							Food and utensils (no spoilt food or dirty utensils,
							food stored seperately from toiletries,
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={7}
							responseArray={responseArray}
							maxPoint={5}
						>
							No External furniture (only standard furniture in
							the room, no office chairs, bean bags, chairs from
							common space)
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={8}
							responseArray={responseArray}
							maxPoint={5}
						>
							No Re-arrangement of room furniture (beds are
							seperated, desks not blocking the door
						</Question>
						<Question
							sendDataToParent={sendDataToParentToParent}
							index={9}
							responseArray={responseArray}
							maxPoint={5}
						>
							No Dining Hall items
						</Question>
						<Button type="submit" onClick={handleClick}>
							Save
						</Button>
					</div>
				</Card.Body>
			</Card>
			{/* {studentRoomScores.map((roomScore) => {
				return (
					<div>
						<h1>{roomScore.studentName}</h1>
						<h2>
							{roomScore.hallName}
							<h3>{roomScore.roomNumber}</h3>
						</h2>
						{roomScore.score}
					</div>
				);
			})} */}
		</>
	);
}
