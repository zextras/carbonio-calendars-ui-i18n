import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
	Row, Select, Icon, Text, Container, Padding, Checkbox
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { find, map } from 'lodash';
import { selectAllFolders } from '../../store/calendars-slice';

const Square = styled.div`
	width: 12px;
	height: 12px;
	border: 1px solid ${({ theme }) => theme.palette.gray2.regular};
	background: ${({ theme, color }) => theme.palette[color].regular};
	border-radius: 4px;
`;
const getReminderItems = (t) => [
	{ label: t('Never'), value: 'never' },
	{ label: t('At time of the event'), value: 0 },
	{ label: t('1 minute before'), value: 1 },
	{ label: t('5 minutes before'), value: 5 },
	{ label: t('10 minutes before'), value: 10 },
	{ label: t('15 minutes before'), value: 15 },
	{ label: t('30 minutes before'), value: 30 },
	{ label: t('45 minutes before'), value: 45 },
	{ label: t('1 hour before'), value: 60 },
	{ label: t('2 hours before'), value: 120 },
	{ label: t('4 hours before'), value: 240 },
	{ label: t('5 hours before'), value: 300 },
	{ label: t('18 hours before'), value: 18 * 60 },
	{ label: t('1 day before'), value: 24 * 60 },
	{ label: t('2 days before'), value: 48 * 60 },
	{ label: t('3 days before'), value: 72 * 60 },
	{ label: t('4 days before'), value: 4 * 24 * 60 },
	{ label: t('1 week before'), value: 7 * 24 * 60 },
	{ label: t('2 weeks before'), value: 2 * 7 * 24 * 60 }
];
const getStatusItems = (t) => [
	{
		label: t('Free'),
		value: 'F',
		customComponent: (
			<Container width="fit" mainAlignment="flex-start" orientation="horizontal" height="fit">
				<Square color="gray6" />
				<Padding left="small"><Text>{t('Free')}</Text></Padding>
			</Container>
		)
	},
	{
		label: t('Tentative'),
		value: 'T',
		customComponent: (
			<Container width="fit" mainAlignment="flex-start" orientation="horizontal" height="fit">
				<Square color="warning" />
				<Padding left="small"><Text>{t('Tentative')}</Text></Padding>
			</Container>
		)
	},
	{
		label: t('Busy'),
		value: 'B',
		customComponent: (
			<Container width="fit" mainAlignment="flex-start" orientation="horizontal" height="fit">
				<Square color="highlight" />
				<Padding left="small"><Text>{t('Busy')}</Text></Padding>
			</Container>
		)
	},
	{
		label: t('Out of Office'),
		value: 'O',
		customComponent: (
			<Container width="fit" mainAlignment="flex-start" orientation="horizontal" height="fit">
				<Square color="primary" />
				<Padding left="small"><Text>{t('Out of Office')}</Text></Padding>
			</Container>
		)
	}
];

export default function AppointmentDetails({
	onPrivateChange, onCalendarChange, onDisplayStatusChange, onReminderChange, data
}) {
	const { t } = useTranslation();

	const statusItems = useMemo(() => getStatusItems(t), [t]);

	const calendars = useSelector(selectAllFolders);
	const calendarItems = useMemo(() => map(
		calendars,
		(cal) => ({
			label: cal.name,
			value: cal.zid,
			customComponent: (
				<Container width="fit" mainAlignment="flex-start" orientation="horizontal">
					<Icon customColor={cal.color.color} icon="CalendarOutline" />
					<Padding left="small"><Text>{cal.name}</Text></Padding>
				</Container>
			)
		})
	), [calendars]);
	const defaultCalendarSelection = useMemo(
		() => find(calendarItems, ['value', data.resource.calendarId]) || calendars[0],
		[calendarItems, calendars, data.resource.calendarId]
	);
	const reminderItems = useMemo(() => getReminderItems(t), [t]);

	const onSelectedCalendarChange = useCallback(
		(id) => onCalendarChange(calendars[id]),
		[calendars, onCalendarChange]
	);
	return (
		<Row
			orientation="horizontal"
			height="fit"
			width="fill"
			padding={{ horizontal: 'medium', bottom: 'medium' }}
			style={{ maxWidth: '70vw' }}
			mainAlignment="flex-start"
		>
			<Row
				width="500px"
				style={{ minWidth: '40%' }}
				padding={{ right: 'small', bottom: 'small' }}
			>
				<Select
					label={t('Display')}
					onChange={onDisplayStatusChange}
					items={statusItems}
					defaultSelection={statusItems[2]}
				/>
			</Row>
			<Row
				width="500px"
				style={{ minWidth: '40%' }}
				padding={{ right: 'small', bottom: 'small' }}
			>
				<Select
					label={t('Reminder')}
					onChange={onReminderChange}
					items={reminderItems}
					defaultSelection={reminderItems[3]}
				/>
			</Row>
			<Row
				width="500px"
				style={{ minWidth: '40%' }}
				padding={{ right: 'small', bottom: 'small' }}
			>
				<Select
					label={t('Calendar')}
					onChange={onSelectedCalendarChange}
					items={calendarItems}
					defaultSelection={defaultCalendarSelection}
					style={{ maxHeight: '42px' }}
				/>
			</Row>
			<Checkbox label={t('Private')} onChange={onPrivateChange} />
		</Row>
	);
}
