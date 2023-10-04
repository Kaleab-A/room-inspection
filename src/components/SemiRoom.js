import React from 'react';
import { Card, Button } from 'react-bootstrap';
import data from '../data.json';

export default function SemiRoom(props) {
	return (
		<React.Fragment>
			<div className="w-100">
				<Button
					style={{
						color: 'green' ? props.done == true : 'red',
						width: '60%',
					}}
					className="m-3"
					onClick={() => props.onClick(0)}
				>
					{props.personName}
				</Button>
				{props.children}
			</div>
		</React.Fragment>
	);
}
