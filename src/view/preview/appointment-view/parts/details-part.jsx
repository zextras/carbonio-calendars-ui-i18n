/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import {
	Container, Icon, Padding, Row, Text
} from '@zextras/zapp-ui';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

export default function DetailsPart({
	subject, calendarColor, calendarName, location, inviteNeverSent, isPrivate, start, end, allDay
}) {
	const { t } = useTranslation();
	const date = React.useMemo(() => {
		if (allDay) {
			const startDate = moment(start);
			const dayOfWeek = startDate.format('dddd');
			return `${dayOfWeek}, ${startDate.format('LL')} - ${t('All day')}`;
		}
		return `${moment(start).format('LLLL')} - ${moment(end).format('LT')}`;
	}, [allDay, start, end, t]);

	return (
		<Container
			orintation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			width="fill"
			height="fit"
			padding={{ vertical: 'medium', horizontal: 'large' }}
		>
			<SubjectRow subject={subject} calendarColor={calendarColor} isPrivate={isPrivate} />
			<InviteNeverSentRow inviteNeverSent={inviteNeverSent} />
			<PaddedRow takeAvailableSpace>
				<Icon icon="Calendar2" customColor={calendarColor} />
				<Padding horizontal="small">
					<Text overflow="break-word">
						{calendarName}
					</Text>
				</Padding>
			</PaddedRow>
			<PaddedRow takeAvailableSpace>
				<Container orientation="horizontal" crossAlignment="center" mainAlignment="flex-start">
					<Icon icon="ClockOutline" />
					<Padding horizontal="small">
						<Text overflow="break-word">
							{date}
							<br />
							GMT
							{`${moment(start).tz(moment.tz.guess()).format('Z')} ${moment.tz.guess()}`}
						</Text>
					</Padding>
				</Container>
			</PaddedRow>
			{
				location && (
					<PaddedRow takeAvailableSpace>
						<Icon icon="PinOutline" />
						<Padding horizontal="small">
							<Text overflow="break-word">
								{location}
							</Text>
						</Padding>
					</PaddedRow>
				)
			}
		</Container>
	);
}

const PaddedRow = styled(Row)`
	padding: 4px 4px;
	align-items: left;
`;

function SubjectRow({ subject, calendarColor, isPrivate }) {
	return (
		<Container padding={{ top: 'big', horizontal: 'medium' }} mainAlignment="center" orientation="horizontal">
			{isPrivate && <Icon icon="Lock" customColor={calendarColor} style={{ padding: '4px' }} />}
			<Padding size="large">
				<Text weight="bold" size="large" overflow="break-word">
					{subject}
				</Text>
			</Padding>
			{/* TODO: tags */}
		</Container>
	);
}

function InviteNeverSentRow({ inviteNeverSent = false }) {
	const { t } = useTranslation();
	if (inviteNeverSent) {
		return (
			<PaddedRow takeAvailableSpace>
				<Icon icon="AlertCircleOutline" color="error" />
				<Padding horizontal="small">
					<Text color="error">
						{t('You haven\'t sent the invitation to the attendees yet')}
					</Text>
				</Padding>
			</PaddedRow>
		);
	}
	return null;
}
