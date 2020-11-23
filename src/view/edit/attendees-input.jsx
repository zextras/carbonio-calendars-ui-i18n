import React from 'react';
import { ChipInput } from '@zextras/zapp-ui';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

export default function AttendeesInput({ attendees, onChange }) {
	const { t } = useTranslation();
	return (
		<ChipInput
			placeholder={t('Attendees')}
			value={attendees}
			onChange={onChange}
			background="gray5"
		/>
	);
}
