import React, { useRef } from 'react';
import {
	Container, Text, Icon, Row, Tooltip
} from '@zextras/zapp-ui';
import moment from 'moment';
import styled from 'styled-components';

const InviteReminder = styled.div`
	width: 8px;
	height: 8px;
	top: -4px;
	left: -4px;
	border-radius: 4px;
	background-color: ${({ theme }) => theme.palette.error.regular};
`;

export default function CustomEvent({ event }) {
	const ref = useRef();

	return (
		<Tooltip label={event.title} placement="top">
			<Container
				width="fill"
				height="fill"
				background="transparent"
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				style={{ position: 'relative' }}
				ref={ref}
			>
				{event.resource.neverSent && (
					<InviteReminder />
				)}
				<Container
					orientation="horizontal"
					width="fill"
					height="fit"
					crossAlignment="center"
					mainAlignment="space-between"
				>
					<Row takeAvailableSpace mainAlignment="flex-start">
						<Text overflow="ellipsis" color="currentColor" weight="medium">
							{`${moment(event.start).format('LT')} - ${moment(event.end).format('LT')}`}
						</Text>
					</Row>
					{ event.resource.isPrivate
						&& (
							<Row padding={{ left: 'extrasmall' }}>
								<Icon color="currentColor" icon="Lock" style={{ minWidth: '16px' }} />
							</Row>
						)}
				</Container>
				<Container
					orientation="horizontal"
					width="fill"
					crossAlignment="flex-start"
					mainAlignment="flex-start"
				>
					<Text overflow="break-word" color="currentColor" style={{ lineHeight: '1.4em' }}>{event.title}</Text>
				</Container>
			</Container>
		</Tooltip>
	);
};
