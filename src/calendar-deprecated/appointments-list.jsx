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

import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, reduce } from 'lodash';
import moment from 'moment';
import { selectAllFolders } from '../store/calendars-slice';
import {
	selectAllAppointments,
	selectEnd,
	selectStart,
	selectStatus,
	selectSyncStatus,
	setRange,
} from '../store/appointments-slice';

export default function AppointmentsList() {
	const calendars = useSelector(selectAllFolders);
	const syncing = useSelector(selectSyncStatus);
	const status = useSelector(selectStatus);
	const start = useSelector(selectStart);
	const end = useSelector(selectEnd);
	const appointments = useSelector(selectAllAppointments);
	const dispatch = useDispatch();

	const setPreviousWeekCbk = useCallback((ev) => {
		ev.preventDefault();
		const prevWeek = moment(start).subtract(1, 'week');
		dispatch(setRange({
			start: prevWeek.startOf('isoWeek').valueOf(),
			end
		}));
	}, [dispatch, end, start]);

	const setNextWeekCbk = useCallback((ev) => {
		ev.preventDefault();
		const nextWeek = moment(end).add(1, 'week');
		dispatch(setRange({
			start,
			end: nextWeek.endOf('isoWeek').valueOf()
		}));
	}, [dispatch, start, end]);

	useEffect(() => {
		if (!isEmpty(calendars) && status === 'init') {
			const now = moment();
			dispatch(setRange({
				start: now.startOf('isoWeek').valueOf(),
				end: now.endOf('isoWeek').valueOf(),
			}));
		}
	}, [dispatch, status, calendars]);

	const memoAppt = useMemo(() => reduce(
		appointments,
		(acc, app) => {
			acc.push((
				<li key={`${app.resources.inviteId}[${app.resources.idx}]`}>
					<span style={{
						backgroundColor: app.resources.calendarColor,
						width: '12px',
						height: '12px',
						display: 'inline-block',
						marginRight: '2px'
					}}
					/>
					{' '}
					{ app.title }
					<ul>
						<li>
							Start:
							{ moment(app.start).format('dddd, Do MMMM YYYY, h:mm:ss a') }
							{' '}

						</li>
						<li>
							End:
							{ moment(app.end).format('dddd, Do MMMM YYYY, h:mm:ss a') }
							{' '}
						</li>
					</ul>
				</li>
			));
			return acc;
		},
		[]
	), [appointments]);

	const memoTimeSpan = useMemo(() => `${moment(start).format('Do MMMM YYYY')} - ${moment(end).format('Do MMMM YYYY')}`, [start, end]);

	return (
		<>
			<div>
				<div>
					Appointments for time span
					{ memoTimeSpan }
					{' '}
					[
					{ status }
					{syncing ? ' (syncing)' : ''}
					]
				</div>
				<span>
					<button type="button" onClick={setPreviousWeekCbk}>&lt;</button>
					<button type="button" onClick={setNextWeekCbk}>&gt;</button>
				</span>
			</div>
			<ul>
				{ memoAppt }
			</ul>
		</>
	);
}
