import React, { useCallback } from 'react';
import {
	Container, Text, Button, Icon, Popover, Divider, Row, Padding
} from '@zextras/zapp-ui';
import { hooks } from '@zextras/zapp-shell';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function SmallPreview({
	anchorRef, open, event, onClose
}) {
	const { t } = useTranslation();
	const replaceHistory = hooks.useReplaceHistoryCallback();
	const editAppointment = useCallback(
		() => {
			onClose();
			replaceHistory({ pathname: '/view', search: `edit=${event.resource.id}` });
		},
		[event, onClose, replaceHistory]
	);
	return (
		<Popover anchorEl={anchorRef} open={open} styleAsModal placement="left" onClose={onClose}>
			<Container padding={{ top: 'medium', horizontal: 'small', bottom: 'extrasmall' }} width="300px">
				<Row width="fill">
					{event.resource.class === 'PRI' && (
						<Row padding={{ all: 'small' }}>
							<Icon customColor={event.resource.calendarColor.color} icon="Lock" style={{ minWidth: '16px' }} />
						</Row>
					)}
					<Row takeAvailableSpace mainAlignment="flex-start">
						<Text size="large" weight="medium">{event.title}</Text>
					</Row>
					<Row>
						{event.resource.attachment && <Icon icon="Attachment" />}
					</Row>
				</Row>
				<Divider />
				<Row width="fill" mainAlignment="flex-start" padding={{ all: 'small' }}>
					<Row padding={{ right: 'small' }}>
						<Icon customColor={event.resource.calendarColor.color} icon="Calendar2" />
					</Row>
					<Row takeAvailableSpace mainAlignment="flex-start">
						<Text overflow="break-word">{event.resource.calendarName}</Text>
					</Row>
				</Row>
				<Row width="fill" mainAlignment="flex-start" padding={{ horizontal: 'small', bottom: 'small' }}>
					<Row padding={{ right: 'small' }}>
						<Icon icon="ClockOutline" />
					</Row>
					<Row takeAvailableSpace mainAlignment="flex-start">
						<Text overflow="break-word">{moment(event.start).format(`LL, LT - [${moment(event.end).format('LT')}], z`)}</Text>
					</Row>
				</Row>
				{event.resource.location && event.resource.location.length > 0 && (
					<Row width="fill" mainAlignment="flex-start" padding={{ horizontal: 'small', bottom: 'small' }}>
						<Row padding={{ right: 'small' }}>
							<Icon icon="PinOutline" />
						</Row>
						<Row takeAvailableSpace mainAlignment="flex-start">
							<Text overflow="break-word">{event.resource.location}</Text>
						</Row>
					</Row>
				)}
				<Row width="fill" mainAlignment="flex-start" padding={{ horizontal: 'small', bottom: 'small' }}>
					<Row padding={{ right: 'small' }}>
						<Icon icon="PersonOutline" />
					</Row>
					<Row takeAvailableSpace mainAlignment="flex-start">
						{event.resource.iAmOrganizer
							? <Text overflow="break-word">{t('You are the organizer')}</Text>
							: <Text overflow="break-word">{`${t('organizer')}: ${event.resource.organizer.displayName || event.resource.organizer.name}`}</Text>}
					</Row>
				</Row>
				{event.resource.fragment && event.resource.fragment.length > 0 && (
					<Row width="fill" mainAlignment="flex-start" padding={{ horizontal: 'small', bottom: 'small' }}>
						<Row padding={{ right: 'small' }}>
							<Icon icon="MessageSquareOutline" />
						</Row>
						<Row takeAvailableSpace mainAlignment="flex-start">
							<Text overflow="break-word">{event.resource.fragment}</Text>
						</Row>
					</Row>
				)}
				<Divider />
				<Row width="fill" mainAlignment="flex-end" padding={{ all: 'small' }}>
					<Padding right="small">
						<Button type="outlined" label="Edit" onClick={editAppointment} />
					</Padding>
					<Button type="outlined" label="Delete" onClick={() => console.warn('not implemented yet')} />
				</Row>
			</Container>
		</Popover>
	);
}
