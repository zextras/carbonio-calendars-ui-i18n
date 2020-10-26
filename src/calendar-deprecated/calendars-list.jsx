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

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduce } from 'lodash';
import {
	checkUncheckCalendar, createCalendar, selectAllFolders, selectStatus
} from '../store/calendars-slice';

export default function CalendarsList() {
	const allCalendars = useSelector(selectAllFolders);
	const storeStatus = useSelector(selectStatus);
	const dispatch = useDispatch();

	const addCalendar = useCallback(
		() => dispatch(createCalendar({ parent: '1', name: 'My Calendar' })),
		[dispatch]
	);

	const checkUncheckCalendarCbk = useCallback((data) => {
		dispatch(checkUncheckCalendar(data));
	}, [dispatch]);

	const calendars = reduce(
		allCalendars,
		(a, c) => {
			a.push((
				<li key={c.zid}>
					<input
						type="checkbox"
						checked={c.checked}
						onChange={(ev) => checkUncheckCalendarCbk({ zid: c.zid, checked: ev.target.checked })}
					/>
					<span style={{
						backgroundColor: c.color,
						width: '12px',
						height: '12px',
						display: 'inline-block',
						marginRight: '2px'
					}}
					/>
					{ c.name }
					{' '}
					{ c.synced ? '' : '(Local)' }
				</li>
			));
			return a;
		},
		[]
	);

	return (
		<>
			<div>
				Store status:
				{ storeStatus }
			</div>
			<ul>
				{ calendars }
			</ul>
			<button type="button" onClick={addCalendar}>
				Add a Calendar
			</button>
		</>
	);
}
