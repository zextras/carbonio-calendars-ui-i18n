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

import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { Button, Container, Padding } from '@zextras/zapp-ui';
import { sendInviteResponse } from '../../../../store/invites-slice';
import { updateParticipationStatus } from '../../../../store/appointments-slice';

export default function ReplyButtonsPart({ inviteId, participationStatus, compNum }) {
	const dispatch = useDispatch();
	const decline = useCallback((ev) => {
		dispatch(sendInviteResponse({
			inviteId, updateOrganizer: false, action: 'DECLINE', compNum
		}))
			.then(() => dispatch(updateParticipationStatus({ inviteId, status: 'DE' })));
	}, [dispatch, inviteId, compNum]);
	const tentative = useCallback((ev) => {
		dispatch(sendInviteResponse({
			inviteId, updateOrganizer: false, action: 'TENTATIVE', compNum
		}))
			.then(() => dispatch(updateParticipationStatus({ inviteId, status: 'TE' })));
	}, [dispatch, inviteId, compNum]);
	const accept = useCallback((ev) => {
		dispatch(sendInviteResponse({
			inviteId, updateOrganizer: false, action: 'ACCEPT', compNum
		}))
			.then(() => dispatch(updateParticipationStatus({ inviteId, status: 'AC' })));
	}, [dispatch, inviteId, compNum]);

	return (
		<Container
			orientation="horizontal"
			crossAlignment="flex-start"
			mainAlignment="center"
			weight="fill"
			height="fit"
			padding={{ all: 'large' }}
		>
			<Button
				type="outlined"
				label="YES"
				icon="Checkmark"
				color="primary"
				onClick={accept}
				disabled={participationStatus === 'AC'}
			/>
			<Padding horizontal="small" />
			<Button
				type="outlined"
				label="MAYBE"
				icon="QuestionMark"
				color="primary"
				onClick={tentative}
				disabled={participationStatus === 'TE'}
			/>
			<Padding horizontal="small" />
			<Button
				type="outlined"
				label="NO"
				icon="Close"
				color="primary"
				onClick={decline}
				disabled={participationStatus === 'DE'}
			/>
		</Container>
	);
}
