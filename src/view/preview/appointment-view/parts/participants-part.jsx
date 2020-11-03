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
import React, { useMemo } from 'react';
import {
	Avatar, Container, Row, Text
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ParticipantsDisplayer from './participants-displayer';
import { selectAccounts } from '../../../../store/accounts-slice';

export default function ParticipantsPart({
	iAmOrganizer, role, organizer, participants, inviteId, compNum
}) {
	const { t } = useTranslation();
	const text = useMemo(() => t('You are the organizer'), [t]);
	const accounts = useSelector(selectAccounts);

	return (
		<Container
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			width="fill"
			height="fit"
			padding={{ horizontal: 'large', vertical: 'medium' }}
		>
			{
				role === 'ORGANIZER' && (
					<Row mainAlignment="flex-start" crossAlignment="center" width="fill">
						<Avatar label={accounts[0].name || accounts[0].displayName} />
						<Text style={{ padding: '0px 8px' }}>{text}</Text>
					</Row>
				)
			}
			{
				role === 'ATTENDEE' && (
					<Row mainAlignment="flex-start" crossAlignment="center" width="fill" padding={{ bottom: 'medium' }}>
						<Avatar label={organizer.name || organizer.email} />
						<Text style={{ padding: '0px 8px' }}>
							<strong>{organizer.name || organizer.email}</strong>
							&nbsp;
							{t('invited you')}
						</Text>
					</Row>
				)
			}
			<ParticipantsDisplayer participants={participants} />
		</Container>
	);
}
