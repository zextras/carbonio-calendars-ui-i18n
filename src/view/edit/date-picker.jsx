import React, {
	useCallback, useEffect, useMemo, useState
} from 'react';
import {
	Checkbox,
	Container, Icon, Padding, Text
} from '@zextras/zapp-ui';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets-moment';
import { useTranslation } from 'react-i18next';
import Styler from './date-picker-style';

momentLocalizer();

export default function DatePicker({
	start, end, allDay, onChange, onAllDayChange
}) {
	const { t } = useTranslation();
	const onStartChange = useCallback((d) => onChange({
		start: d.getTime(),
		end: (
			end > d.getTime()
				? end
				: d.getTime() + (15 * 60 * 1000)
		)
	}), [end, onChange]);
	const onEndChange = useCallback((d) => onChange({
		end: d.getTime(),
		start: (
			d.getTime() > start
				? start
				: d.getTime() - (15 * 60 * 1000)
		)
	}), [onChange, start]);
	const startDate = useMemo(() => new Date(start), [start]);
	const endDate = useMemo(() => new Date(end), [end]);

	useEffect(() => {
		if (allDay) {
			onChange({
				start: startDate.setHours(0, 0, 0, 0),
				end: endDate.setHours(0, 0, 0, 0)
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allDay]);
	return (
		<>
			<Styler
				allDay={allDay}
				orientation="horizontal"
				padding={{ horizontal: 'medium', bottom: 'medium' }}
				height="fit"
				mainAlignment="flex-start"
			>
				<Container padding={{ right: 'small' }} crossAlignment="flex-start" style={{ maxWidth: '500px' }}>
					<Text size="small">{`${allDay ? t('Start date') : t('Start date and time')}:`}</Text>
					<DateTimePicker
						time={!allDay}
						value={startDate}
						onChange={onStartChange}
						dateIcon={<Padding all="small"><Icon icon="CalendarOutline" /></Padding>}
						timeIcon={<Padding all="small"><Icon icon="ClockOutline" /></Padding>}
					/>
				</Container>
				<Container crossAlignment="flex-start" style={{ maxWidth: '500px' }}>
					<Text size="small">{`${allDay ? t('End date') : t('End date and time')}:`}</Text>
					<DateTimePicker
						time={!allDay}
						value={endDate}
						onChange={onEndChange}
						dateIcon={<Padding all="small"><Icon icon="CalendarOutline" /></Padding>}
						timeIcon={<Padding all="small"><Icon icon="ClockOutline" /></Padding>}
					/>
				</Container>
			</Styler>
			<Container height="fit" padding={{ horizontal: 'medium', bottom: 'medium' }} orientation="horizontal" mainAlignment="flex-start">
				<Checkbox label={t('All day')} onChange={onAllDayChange} />
			</Container>
		</>
	);
}
