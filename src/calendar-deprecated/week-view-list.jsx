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
import { reduce, isEmpty } from 'lodash';
import moment from 'moment';
import {
	selectCurrentWeek,
	selectCurrentWeekAppointments,
	selectCurrentYear,
	selectFetchStatus,
	setCurrentWeek,
	setNextWeek,
	setPreviousWeek,
} from '../store/week-slice';
import { selectAllFolders } from '../store/calendars-slice';

export default function WeekViewList() {
	const currentWeek = useSelector(selectCurrentWeek);
	const currentYear = useSelector(selectCurrentYear);
	const fetchStatus = useSelector(selectFetchStatus);
	const appointments = useSelector(selectCurrentWeekAppointments);
	const calendars = useSelector(selectAllFolders);
	const dispatch = useDispatch();

	const setPreviousWeekCbk = useCallback((ev) => {
		ev.preventDefault();
		dispatch(setPreviousWeek());
	}, [dispatch]);

	const setCurrentWeekCbk = useCallback((ev) => {
		ev.preventDefault();
		dispatch(setCurrentWeek());
	}, [dispatch]);

	const setNextWeekCbk = useCallback((ev) => {
		ev.preventDefault();
		dispatch(setNextWeek());
	}, [dispatch]);

	useEffect(() => {
		if (!isEmpty(calendars) && fetchStatus === 'init') {
			dispatch(setCurrentWeek());
		}
	}, [dispatch, fetchStatus, calendars]);

	const memoAppt = useMemo(() => reduce(
		appointments,
		(acc, app) => {
			acc.push((
				<li key={app.resources.id}>
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
							{ moment(app.start).format('dddd, Do, h:mm:ss a') }
							{' '}

						</li>
						<li>
							End:
							{ moment(app.end).format('dddd, Do, h:mm:ss a') }
							{' '}

						</li>
					</ul>
				</li>
			));
			return acc;
		},
		[]
	), [appointments]);

	const memoTimeSpan = useMemo(() => {
		const week = moment().isoWeek(currentWeek).year(currentYear);
		return `${week.startOf('isoWeek').format('Do')} - ${week.endOf('isoWeek').format('Do MMMM YYYY')}`;
	}, [currentWeek, currentYear]);

	return (
		<>
			<div>
				<div>
					Appointments for week
					{ memoTimeSpan }
					{' '}
					(
					{ currentWeek }
					) [
					{ fetchStatus }
					]
				</div>
				<span>
					<button type="button" onClick={setPreviousWeekCbk}>&lt;</button>
					<button type="button" onClick={setCurrentWeekCbk}>Current Week</button>
					<button type="button" onClick={setNextWeekCbk}>&gt;</button>
				</span>
			</div>
			<ul>
				{ memoAppt }
			</ul>
		</>
	);
}
