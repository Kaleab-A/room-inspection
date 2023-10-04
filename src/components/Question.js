import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';

export default function Question(props) {
	const [value, setValue] = useState(props.responseArray[props.index]);

	function changeHandler(e) {
		let temp = props.responseArray;
		temp[props.index] = parseInt(e.target.value);
		props.sendDataToParent(temp);
		setValue(parseInt(e.target.value));
	}

	return (
		<div className="singleQuestion">
			<h5>{props.children}</h5>
			<div style={{ display: 'flex' }}>
				<RangeSlider
					className="formSlider"
					value={props.responseArray[props.index]}
					min="0"
					max={props.maxPoint}
					step={0.5}
					onChange={changeHandler}
				/>
				<input
					type="text"
					value={props.responseArray[props.index]}
					style={{ width: '40px', textAlign: 'center' }}
				></input>
			</div>
		</div>
	);
}
