import React, { useRef, useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Question from './Question';
import app, { db } from '../firebase';
import html2canvas from 'html2canvas';

import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';

export default function Rubric({ personName, hallName, roomNumber, onClick }) {
	// TODO - Work on disabling the whole form is lastUpdatedDate is within a week
	// TODO - Monthly Average for Hall head implementation
	// TODO - Show weakness on hover on email

	const roomScoreCollectionRef = collection(db, 'studentRoomScores');
	const [studentRoomScores, setstudentRoomScores] = useState([]);
	const [responseArray, setResponseArray] = useState([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	]);
	const [totalScore, setTotalScore] = useState(0);
	const [isDBChanged, setIsDBChanged] = useState(false);
	const questionList = [
		'Clean Floor',
		'Beds neatly made',
		'Desk state',
		'Empty Dust Bin',
		'Neatly Folded Clothes',
		'State of heater, and windows',
		'Food and Utensils',
		'No External Furniture',
		'No Re-arranegement of Furniture',
		'No Dinning Hall Items',
	];

	useEffect(() => {
		console.log('isEffect Running');
		const getUsers = async () => {
			const data = await getDocs(roomScoreCollectionRef);
			setstudentRoomScores(
				data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
		};

		getUsers();
	}, [isDBChanged]);

	const createUser = async () => {
		let resetDate = getNextDayOfWeek(new Date(), 7);
		let currDate = [new Date()];
		let initScore = [calculateScore()];
		let detailedScore = [getDetails()];
		let data = {
			studentName: personName,
			score: initScore,
			roomNumber: roomNumber,
			hallName: hallName,
			updatedDates: currDate,
			resetDate: resetDate,
			details: detailedScore,
		};

		await addDoc(roomScoreCollectionRef, data);
	};

	const updateUser = async (
		id,
		prevScore,
		prevDetailScore,
		oldUpdatedDates
	) => {
		console.log('PrevScore', prevScore);
		let updatedScore = prevScore;
		updatedScore.push(calculateScore());

		let updatedDetails = prevDetailScore;
		updatedDetails.push(getDetails());

		let updatedResetDate = getNextDayOfWeek(new Date(), 7);

		let newUpdatedDates = oldUpdatedDates;
		newUpdatedDates.push(new Date());

		const userDoc = doc(db, 'studentRoomScores', id);
		const newFields = {
			score: updatedScore,
			details: updatedDetails,
			resetDate: updatedResetDate,
			updatedDates: newUpdatedDates,
		};
		await updateDoc(userDoc, newFields);
		setIsDBChanged(!isDBChanged);
	};

	function getNextDayOfWeek(date, dayOfWeek) {
		var resultDate = new Date(date.getTime());
		resultDate.setDate(
			date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7)
		);
		return resultDate;
	}

	function getDetails() {
		let details = {};

		for (let index = 0; index < questionList.length; index++) {
			let question = questionList[index];
			details[question] = responseArray[index];
		}

		console.log(details);
		return details;
	}

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
			let id = '';
			let prevScore = '';
			let prevDetailScores = '';
			let oldUpdatedDates = '';
			for (var i = 0; i < studentRoomScores.length; i++) {
				let ele = studentRoomScores[i];
				if (ele.studentName == personName) {
					id = ele.id;
					prevScore = ele.score;
					prevDetailScores = ele.details;
					oldUpdatedDates = ele.updatedDates;
					break;
				}
			}
			updateUser(id, prevScore, prevDetailScores, oldUpdatedDates);
		}
		setIsDBChanged(!isDBChanged);
		// sendReport();

		onClick();
	}

	function sendDataToParentToParent(data) {
		setResponseArray(data);
		calculateScore();
	}

	return (
		<>
			<Card>
				<Card.Body>
					<center>
						<h1>{personName}</h1>
					</center>
					<br></br>
					<h2> Total Score: {totalScore}</h2>
					<br />
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
						<br />
						<Button
							id="formSubmitButton"
							type="submit"
							onClick={handleClick}
						>
							Save
						</Button>
					</div>
				</Card.Body>
			</Card>
		</>
	);
}
