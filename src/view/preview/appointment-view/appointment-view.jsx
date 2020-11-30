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
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Container } from '@zextras/zapp-ui';
import { useDispatch, useSelector } from 'react-redux';
import { find, reduce } from 'lodash';
import ImageAndIconPart from './parts/image-and-icon-part';
import ParticipantsPart from './parts/participants-part';
import MessagePart from './parts/message-part';
import ReminderPart from './parts/reminder-part';
import DetailsPart from './parts/details-part';
import { emptyInvite, getOneInvite, selectAllInvites } from '../../../store/invites-slice';
import { selectAllAppointments } from '../../../store/appointments-slice';
import AttachmentsPart from './parts/attachments-part';
import ReplyButtonsPart from './parts/reply-buttons-part';
import StyledDivider from '../../components/styled-divider';
import Panel from '../../components/panel';
import useActions from './parts/useActions';


const BodyContainer = styled(Container)`
	overflow-y: auto;
	overflow-x: no-scroll;
	// TODO: personalize scrollbar
	
	//
	// // ::-webkit-scrollbar {
  // //   width: 12px;
	// // }
	//
	// /* Track */
	// // ::-webkit-scrollbar-track {
	// // 		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
	// // 		-webkit-border-radius: 10px;
	// // 		border-radius: 10px;
	// // }
	//
	// /* Handle */
	// ::-webkit-scrollbar-thumb {
	// 		-webkit-border-radius: 10px;
	// 		border-radius: 10px;
	// 		background: rgba(255,0,0,0.8); 
	// 		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
	// }
`;

function findAttachments(parts, acc) {
	return reduce(
		parts,
		(found, part) => {
			if (part.disposition === 'attachment') {
				found.push(part);
			}
			return findAttachments(part.parts, found);
		},
		acc
	);
}

function AppointmentBody({ message, invite }) { // TODO: scrollable
	const attachments = useMemo(() => findAttachments(invite.parts, []), [invite]);

	return (
		<BodyContainer
			orientation="vertical"
			mainAlignment="flex-start"
			width="fill"
			height="fill"
			padding={{ top: 'small' }}
		>
			<DetailsPart
				subject={message.title}
				calendarColor={message.resource.calendarColor.color}
				calendarName={message.resource.calendarName}
				location={message.resource.location}
				isPrivate={message.resource.isPrivate}
				inviteNeverSent={message.resource.inviteNeverSent}
				start={message.start}
				end={message.end}
				allDay={message.allDay}
			/>
			<StyledDivider />
			{message.resource.role === 'ATTENDEE'
			&& (
				<>
					<ReplyButtonsPart
						inviteId={message.resource.inviteId}
						participationStatus={message.resource.participationStatus}
						compNum={invite.compNum}
					/>
					<StyledDivider />
				</>
			)}
			<ParticipantsPart
				iAmOrganizer={message.resource.iAmOrganizer}
				role={message.resource.role}
				organizer={message.resource.organizer}
				participants={invite.participants}
				inviteId={message.resource.inviteId}
				compNum={invite.compNum}
			/>
			{
				invite.fullInvite && invite.fullInvite.fr && (
					<>
						<StyledDivider />
						<MessagePart
							fullInvite={invite.fullInvite}
							inviteId={message.resource.inviteId}
							parts={invite.parts}
						/>
					</>
				)
			}
			<StyledDivider />
			<ReminderPart alarm={invite.alarm} />
			{
				attachments.length > 0 && (
					<>
						<StyledDivider />
						<AttachmentsPart
							attachments={attachments}
							message={{ id: message.resource.inviteId, subject: message.title }}
						/>
					</>
				)
			}
		</BodyContainer>
	);
}

export default function AppointmentView({ inviteId, idx, close }) {
	const dispatch = useDispatch();

	const appointments = useSelector(selectAllAppointments);
	const invites = useSelector(selectAllInvites);

	const appointment = useMemo(
		() => find(appointments, (a) => a.resource.inviteId === inviteId && a.resource.idx === idx),
		[appointments, idx, inviteId]
	);
	const invite = useMemo(() => invites[inviteId] || emptyInvite(),
		[invites, inviteId]);

	useEffect(() => {
		if (appointment) dispatch(getOneInvite({ inviteId }));
	}, [inviteId, appointment, dispatch]);

	const actions = useActions({ appointment, invite, close });

	return (
		<Panel
			closeAction={close}
			actions={actions}
			resizable={false}
			title={appointment.title}
		>
			<ImageAndIconPart color={appointment.resource.calendarColor.color} />
			<AppointmentBody message={appointment} invite={invite} />
		</Panel>
	);
}
