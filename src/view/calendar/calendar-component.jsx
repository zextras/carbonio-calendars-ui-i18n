import React, { useCallback, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { reduce, find } from 'lodash';
import CustomEvent from './custom-event';
import CustomEventWrapper from './custom-event-wrapper';
import CustomToolbar from './custom-toolbar';
import {
	selectAllAppointments,
	selectFilteredAppointments,
	setRange
} from '../../store/appointments-slice';
import { selectCheckedCalendars } from '../../store/calendars-slice';

const localizer = momentLocalizer(moment);

const nullAccessor = () => null;

const views = { month: true, week: true, day: true };

const customComponents = {
	toolbar: CustomToolbar,
	event: CustomEvent,
	eventWrapper: CustomEventWrapper,
};

export default function CalendarComponent() {
	const appointments = useSelector(selectAllAppointments);
	const selectedCalendars = useSelector(selectCheckedCalendars);
	const events = useMemo(() => reduce(
		appointments,
		(acc, appt) => {
			if (find(selectedCalendars, ['zid', appt.resource.calendarId])) {
				acc.push({ ...appt, start: new Date(appt.start), end: new Date(appt.end) });
			}
			return acc;
		},
		[]
	), [appointments, selectedCalendars]);

	const dispatch = useDispatch();

	const onRangeChange = useCallback((range) => {
		if (range.length) {
			dispatch(setRange({
				start: moment(range[0]).startOf('day').valueOf(),
				end: moment(range[range.length - 1]).endOf('day').valueOf(),
			}));
		}
		else {
			dispatch(setRange({
				start: moment(range.start).startOf('day').valueOf(),
				end: moment(range.end).endOf('day').valueOf(),
			}));
		}
	}, [dispatch]);

	useEffect(() => console.log('appointments changed'), [appointments]);
	return (
		<Calendar
			localizer={localizer}
			defaultView="week"
			events={events}
			startAccessor="start"
			endAccessor="end"
			style={{ width: '100%' }}
			components={customComponents}
			views={views}
			tooltipAccessor={nullAccessor}
			onRangeChange={onRangeChange}
		/>
	);
}
