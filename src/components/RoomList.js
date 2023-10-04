import React, { useState, useEffect } from 'react';
import data from '../data.json';
import SemiRoom from './SemiRoom';
import Rubric from './Rubric';
import { Button, Card } from 'react-bootstrap';
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import app, { db } from '../firebase';
import emailjs from 'emailjs-com';
import commonEmail from '../commonEmail.json';
import receivers from '../receivers.json';
import ALAstud from '../ALAstud.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function RoomList(props) {
	// TODO Send monthly email to hall head
	// TODO Send monthly email to each student
	// TODO Ticking green when changing eventListener on Each slider
	// TODO Changing color to green when room is inspected (Read the chaged ones from the database)
	// TODO Solve the weird Date Issue of JS

	const [loadForm, setLoadForm] = useState(false);
	const [person1, setPerson] = useState(0);
	const [roomNumber, setRoomNumber] = useState('');
	const [done, setDone] = useState({});

	const roomScoreCollectionRef = collection(db, 'studentRoomScores');
	const [studentRoomScores, setstudentRoomScores] = useState([]);
	const [recheckDB, setRecheckDB] = useState(0);

	const [doneNewRound, setDoneNewRound] = useState([]);

	useEffect(() => {
		const getUsers = async () => {
			const data = await getDocs(roomScoreCollectionRef);
			setstudentRoomScores(
				data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
		};

		getUsers();
		processNewRound();
	}, [recheckDB]);

	const getUsers = async () => {
		const data = await getDocs(roomScoreCollectionRef);
		setstudentRoomScores(
			data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
		);
		return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	};

	function handleClick(hallName, roomNumber, personName) {
		setLoadForm(true);
		setPerson(personName);
		setRoomNumber(roomNumber);
	}

	function getPersonResetDate(name) {
		for (var ind = 0; ind < studentRoomScores.length; ind++) {
			var a = studentRoomScores[ind];
			if (a.studentName === name) {
				return a.resetDate;
			}
		}
	}

	const getScoreTable = (studentRoomScores, monthly) => {
		let scoreTable = '';
		if (!monthly) {
			for (var i = 0; i < studentRoomScores.length; i++) {
				let ele = studentRoomScores[i];
				if (ele.hallName == props.hallName) {
					scoreTable +=
						'<tbody><tr><td>' +
						ele.studentName +
						'</td><td>' +
						ele.score[ele.score.length - 1].toString() +
						'</td></tr></tbody>';
				}
			}
			scoreTable =
				`<table class="blue">
			<thead>
				<tr>
					<th>Student Name</th>
					<th>Score</th>
				</tr>
			</thead>` +
				scoreTable +
				'</table>';
		} else {
			let countScores = 0;
			for (var i = 0; i < studentRoomScores.length; i++) {
				let ele = studentRoomScores[i];
				if (ele.hallName == props.hallName) {
					let scoreTableRow = '<td>' + ele.studentName + '</td>';
					let summScores = 0;
					countScores = 0;
					for (let j = 0; j < ele.updatedDates.length; j++) {
						let updatedDate = second2Date(ele.updatedDates[j]);
						if (updatedDate.getMonth() == new Date().getMonth()) {
							scoreTableRow +=
								'<td>' + ele.score[j].toString() + '</td>';
							summScores += ele.score[j];
							countScores += 1;
						}
					}
					scoreTableRow +=
						'<td>' +
						(summScores / parseFloat(countScores))
							.toFixed(2)
							.toString() +
						'</td>';
					scoreTableRow =
						'<tbody><tr>' + scoreTableRow + '</tr></tbody>';
					scoreTable += scoreTableRow;
				}
			}
			scoreTable =
				`<table class="blue">
				<thead>
					<tr>
						<th>Student Name</th>
						<th colspan='` +
				countScores.toString() +
				`%'>Scores</th>
						<th>Average</th>
					</tr>
				</thead>` +
				scoreTable +
				'</table>';
		}
		scoreTable =
			`<style>
				body{
				font:1.2em normal Arial,sans-serif;
				color:#34495E;
				}
				.container{
				width:90%;
				margin:auto;
				}
				table{
				border-collapse:collapse;
				width:100%;
				}
				.blue{
				border:2px solid #1ABC9C;
				}
				.blue thead{
				background:#1ABC9C;
				}
				thead{
				color:white;
				}
				th,td{
				text-align:center;
				padding:5px 0;
				}
				tbody tr:nth-child(even){
				background:#ECF0F1;
				}
				tbody tr:hover{
				background:#BDC3C7;
				color:#FFFFFF;
				}
				.up{
				cursor:pointer;
				}
			</style>
			<h2>` +
			props.hallName +
			` Hall</h2>` +
			scoreTable;
		return scoreTable;
	};

	const sendReport = () => {
		// e.preventDefault();
		getUsers().then((dataFromDB) => {
			let scoreTable = getScoreTable(dataFromDB, false);
			console.log('week', scoreTable);
			let ccList = [];
			let toNameList = [];

			Object.keys(receivers).map((currHall) => {
				console.log('ddd', currHall, props.hallName);
				if (currHall == props.hallName) {
					ccList = ccList.concat(Object.keys(receivers[currHall]));
					toNameList = toNameList.concat(
						Object.values(receivers[currHall])
					);
				}
			});

			ccList = ccList.concat(Object.keys(commonEmail));
			toNameList = toNameList.concat(Object.values(commonEmail));

			for (var i = 0; i < toNameList.length; i++) {
				let templateParams = {
					to_name: toNameList[i],
					message: 'Test ' + scoreTable,
					from_name: 'Room Inspection App',
					cc: ccList[i],
					hallName: props.hallName,
					interval: 'Weekly',
				};

				emailjs
					.send(
						'service_98l69yf',
						'template_zr1zaxr',
						templateParams,
						'user_mjtVgydmQqNyInHOOp9m2'
					)
					.then(
						function (response) {
							console.log(
								'SUCCESS!',
								response.status,
								response.text
							);
						},
						function (error) {
							console.log('FAILED...', error);
						}
					);
			}

			// Monthly Email to Students
			// Checking if month reached
			var isMonth = true;

			if (
				new Date().getMonth() !=
				new Date(
					new Date().getTime() + 7 * 24 * 60 * 60 * 1000
				).getMonth()
			) {
				isMonth = true;
			}

			// Monthly Email Content Prep
			if (isMonth) {
				let scoreTable = getScoreTable(dataFromDB, true);
				console.log(scoreTable);
				let ccList = [];
				let toNameList = [];

				Object.keys(receivers).map((currHall) => {
					console.log('ddd', currHall, props.hallName);
					if (currHall == props.hallName) {
						ccList = ccList.concat(
							Object.keys(receivers[currHall])
						);
						toNameList = toNameList.concat(
							Object.values(receivers[currHall])
						);
					}
				});

				ccList = ccList.concat(Object.keys(ALAstud));
				toNameList = toNameList.concat(Object.values(ALAstud));

				console.log(props.hallName, ccList, toNameList);

				for (var i = 0; i < toNameList.length; i++) {
					let templateParams = {
						to_name: toNameList[i],
						message: 'Test ' + scoreTable,
						from_name: 'Room Inspection App',
						cc: ccList[i],
						hallName: props.hallName,
						interval: 'Monthly',
					};

					emailjs
						.send(
							'service_98l69yf',
							'template_zr1zaxr',
							templateParams,
							'user_mjtVgydmQqNyInHOOp9m2'
						)
						.then(
							function (response) {
								console.log(
									'SUCCESS!',
									response.status,
									response.text
								);
							},
							function (error) {
								console.log('FAILED...', error);
							}
						);
				}
			}
		});
	};

	const second2Date = (seconds) => {
		let updatedDate = new Date(seconds * 1000);
		updatedDate.setFullYear(new Date().getFullYear());
		return updatedDate;
	};

	// const processDoneThisWeek = () => {
	// 	getUsers().then((dataFromDB) => {
	// 		console.log(dataFromDB);
	// 		for (let i = 0; i < dataFromDB.length; i++) {
	// 			let ele = dataFromDB[i];
	// 			if (ele.hallName == props.hallName) {
	// 				let eleResetDate = second2Date(ele.resetDate);
	// 				// if ()
	// 			}
	// 		}
	// 	});
	// };

	const processNewRound = () => {
		let maxxScoreLength = 0;
		let recentlyUpdated = [];
		let runnerUpExist = false;

		for (let i = 0; i < studentRoomScores.length; i++) {
			let ele = studentRoomScores[i];
			if (ele.hallName == props.hallName) {
				maxxScoreLength = Math.max(maxxScoreLength, ele.score.length);
			}
		}

		for (let i = 0; i < studentRoomScores.length; i++) {
			let ele = studentRoomScores[i];
			if (ele.hallName == props.hallName) {
				if (maxxScoreLength == ele.score.length) {
					recentlyUpdated.push(ele.studentName);
				} else {
					runnerUpExist = true;
				}
			}
		}

		if (!runnerUpExist) {
			recentlyUpdated = [];
		}

		setDoneNewRound(recentlyUpdated);
	};

	const checkFilled = (personName) => {
		let maxxLength = 0;
		let runnerUpLength = -1;
		let personScoreLen = -1;
		let filled = true;

		for (let i = 0; i < studentRoomScores.length; i++) {
			let ele = studentRoomScores[i];
			if (ele.hallName == props.hallName) {
				maxxLength = Math.max(maxxLength, ele.score.length);
				if (ele.studentName == personName) {
					personScoreLen = ele.score.length;
				}
			}
		}

		for (let i = 0; i < studentRoomScores.length; i++) {
			let ele = studentRoomScores[i];
			if (
				ele.hallName == props.hallName &&
				ele.score.length != maxxLength
			) {
				runnerUpLength = Math.max(runnerUpLength, ele.score.length);
				if (ele.studentName == personName) {
					personScoreLen = ele.score.length;
				}
			}
		}

		if (runnerUpLength == -1 || personScoreLen < maxxLength) {
			filled = false;
		}

		return filled;
	};

	return (
		<>
			{!loadForm ? (
				Object.keys(data[props.hallName]).map((roomNumber) => {
					let roomMates = data[props.hallName][roomNumber];
					return (
						<Card className="w-100" key={roomNumber}>
							<Card.Body className="d-flex justify-content-around">
								{roomNumber}
								{roomMates.map((personName) => {
									return (
										<>
											<SemiRoom
												hallName={props.hallName}
												roomNumber={roomNumber}
												key={personName}
												personName={personName}
												done={done[personName]}
												onClick={() => {
													handleClick(
														props.hallName,
														roomNumber,
														personName
													);
												}}
											>
												<>
													{checkFilled(personName) ? (
														<FontAwesomeIcon
															icon={faCheck}
															color="green"
															className="fa-2x"
														/>
													) : (
														<FontAwesomeIcon
															icon={faTimesCircle}
															color="red"
															className="fa-2x"
														/>
													)}
												</>
											</SemiRoom>
										</>
									);
								})}
							</Card.Body>
						</Card>
					);
				})
			) : (
				<Rubric
					personName={person1}
					hallName={props.hallName}
					roomNumber={roomNumber}
					onClick={() => {
						setRecheckDB(1 - recheckDB);
						setLoadForm(false);
					}}
				/>
			)}
			{!loadForm && (
				<Button id="sendReportButton" onClick={sendReport}>
					Send Report
				</Button>
			)}
		</>
	);
}
