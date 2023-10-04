import React, { useState } from 'react';
import data from '../data.json';
import Hall from './Hall';
import RoomList from './RoomList';

export default function HallList() {
	const [loadRooms, setLoadRooms] = useState(false);
	const [hallToLoad, setHallToLoad] = useState('');

	function handleClick(hallName) {
		setHallToLoad(hallName);
		setLoadRooms(true);
	}

	return (
		<>
			<center>
				{!loadRooms && <h1>Hall Lists</h1>}
				{loadRooms && <h1>Rooms in {hallToLoad}</h1>}
				<br></br>
			</center>
			{!loadRooms ? (
				<div>
					{Object.keys(data).map((hall) => {
						return (
							<Hall
								hall={hall}
								key={hall}
								onClick={() => handleClick(hall)}
							></Hall>
						);
					})}
				</div>
			) : (
				<RoomList hallName={hallToLoad} />
			)}
		</>
	);
}
