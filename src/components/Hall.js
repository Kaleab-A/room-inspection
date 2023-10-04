import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function Hall(props) {
	return (
		<div className="mb-3 ">
			<Button className="w-100 p-3" onClick={props.onClick}>
				{props.hall}
			</Button>
		</div>
	);
}
