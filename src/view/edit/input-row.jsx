import React from 'react';
import { Row, Input } from '@zextras/zapp-ui';

export default function InputRow({ onChange, label, defaultValue }) {
	return (
		<Row
			height="fit"
			width="fill"
			padding={{ horizontal: 'medium', bottom: 'medium' }}
			style={{ maxWidth: '600px' }}
		>
			<Input
				backgroundColor="gray5"
				label={label}
				defaultValue={defaultValue}
				onChange={onChange}
			/>
		</Row>
	);
}
