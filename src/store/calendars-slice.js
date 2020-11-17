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

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import produce from 'immer';
import { setLightness } from 'polished';
import { network } from '@zextras/zapp-shell';
import {
	reduce, isEmpty, forEach, filter,
} from 'lodash';
import { ZIMBRA_STANDARD_COLORS } from '../zimbra-standard-colors';

export function findCalendars(folder) {
	const toRet = {};
	if (folder.view === 'appointment' || folder.id === '3') {
		const rgbColor = folder.rgb
			? {
				color: folder.rgb,
				background: setLightness(0.9, folder.rgb)
			}
			: ZIMBRA_STANDARD_COLORS[0];

		toRet[folder.id] = {
			checked: /#/.test(folder.f),
			color: folder.color
				? ZIMBRA_STANDARD_COLORS[folder.color]
				: rgbColor,
			zid: folder.id,
			name: folder.name,
			parentZid: folder.l,
			synced: true,
			owner: folder.owner, // It's specified only if It's not the current user
		};
	}
	return reduce(
		folder.folder || [],
		(r, f) => ({
			...r,
			...findCalendars(f),
		}),
		toRet,
	);
}

export const fetchCalendars = createAsyncThunk('calendars/fetchCalendars', async () => {
	const { folder } = await network.soapFetch(
		'Sync',
		{
			_jsns: 'urn:zimbraMail',
			typed: 1,
		},
	);
	return findCalendars(folder[0]);
});

function fetchCalendarsPending(state, action) {
	state.status = 'syncing';
}

function fetchCalendarsFullFilled(state, action) {
	state.status = 'succeeded';
}

function fetchCalendarsRejected(state, action) {
	state.status = 'failed';
	// state.error = action.error.message
}

function createCalendarFullFilled(state, { payload }) {
	const [calendars, tmpId] = payload;
	state.status = 'succeeded';
	delete state.calendars[tmpId];
	reduce(
		calendars,
		(r, v, k) => {
			r[k] = v;
			return r;
		},
		state.calendars,
	);
}

function calendarActionRejected(state, { meta, error }) {
	const { arg, requestId } = meta;
	state.calendars[arg.zid || requestId].error = error;
}

function createLocalCalendarReducer(state, { payload }) {
	state.calendars[payload.zid] = payload;
}

export const createCalendar = createAsyncThunk('calendars/create', async ({ name, parent }, { dispatch, requestId }) => {
	dispatch({
		type: 'calendars/createLocalCalendar',
		payload: {
			checked: true,
			zid: requestId,
			name,
			parentZid: parent,
			synced: false,
		},
	});
	const { folder } = await network.soapFetch(
		'CreateFolder',
		{
			_jsns: 'urn:zimbraMail',
			folder: {
				rgb: ZIMBRA_STANDARD_COLORS[1],
				f: '#',
				l: parent,
				name,
				view: 'appointment',
			},
		},
	);
	return [findCalendars(folder[0]), requestId];
});

export const handleSyncData = createAsyncThunk('calendars/handleSyncData', async ({
	firstSync, token, folder, deleted,
}, { dispatch }) => {
	if (firstSync) {
		await dispatch({
			type: 'calendars/setCalendars',
			payload: findCalendars(folder[0]),
		});
	}
	else {
		const updatedCalendars = findCalendars(folder ? folder[0] : []);
		if (!isEmpty(updatedCalendars)) {
			await dispatch({
				type: 'calendars/updateCalendars',
				payload: updatedCalendars,
			});
		}
		if (deleted) {
			await dispatch({
				type: 'calendars/deleteCalendars',
				payload: deleted[0].ids.split(','),
			});
		}
	}
});

function setCalendarsReducer(state, { payload }) {
	state.calendars = {};
	reduce(
		payload,
		(r, v, k) => {
			r[k] = v;
			return r;
		},
		state.calendars,
	);
}

function updateCalendarsReducer(state, { payload }) {
	reduce(
		payload,
		(r, v, k) => {
			r[k] = v;
			return r;
		},
		state.calendars,
	);
}

function deleteCalendarsReducer(state, { payload }) {
	forEach(
		payload,
		(id) => state.calendars[id] && delete state.calendars[id],
	);
}

export const checkUncheckCalendar = createAsyncThunk('calendars/checkUncheck', async ({ zid, checked }, { dispatch }) => {
	await network.soapFetch(
		'FolderAction',
		{
			_jsns: 'urn:zimbraMail',
			action: {
				op: checked ? 'check' : '!check',
				id: zid,
			},
		},
	);
	return ({
		zid,
		checked,
	});
});

function checkUncheckCalendarPending(state, { meta }) {
	const { arg } = meta;
	state.calendars[arg.zid].checked = arg.checked;
	state.calendars[arg.zid].synced = false;
}

function checkUncheckCalendarFulfilled(state, { payload }) {
	const { zid, checked } = payload;
	state.calendars[zid].checked = checked;
	state.calendars[zid].synced = true;
}

export const calendarsSlice = createSlice({
	name: 'calendars',
	initialState: {
		status: 'idle',
		calendars: {},
	},
	reducers: {
		createLocalCalendar: produce(createLocalCalendarReducer),
		setCalendars: produce(setCalendarsReducer),
		updateCalendars: produce(updateCalendarsReducer),
		deleteCalendars: produce(deleteCalendarsReducer),
	},
	extraReducers: {
		[handleSyncData.pending]: produce(fetchCalendarsPending),
		[handleSyncData.fulfilled]: produce(fetchCalendarsFullFilled),
		[handleSyncData.rejected]: produce(fetchCalendarsRejected),
		[createCalendar.pending]: produce((state, action) => undefined),
		[createCalendar.fulfilled]: produce(createCalendarFullFilled),
		[createCalendar.rejected]: produce(calendarActionRejected),
		[checkUncheckCalendar.pending]: produce(checkUncheckCalendarPending),
		[checkUncheckCalendar.fulfilled]: produce(checkUncheckCalendarFulfilled),
		[checkUncheckCalendar.rejected]: produce(calendarActionRejected),
	},
});

export const { createLocalCalendar } = calendarsSlice.actions;

export default calendarsSlice.reducer;

export function selectAllFolders({ calendars }) {
	return calendars ? calendars.calendars : [];
}

export function selectStatus({ calendars }) {
	return calendars.status;
}

export function selectCalendar({ calendars }, { id }) {
	return calendars.calendars[id];
}

export function selectAllCheckedCalendarsQuery({ calendars }) {
	return reduce(
		filter(calendars.calendars, 'checked'),
		(acc, c) => {
			acc.push(`inid:"${c.zid}"`);
			return acc;
		},
		[],
	).join(' OR ');
}

export function selectUncheckedCalendars({ calendars }) {
	return filter(calendars.calendars, ['checked', false]);
}

export function selectCheckedCalendars({ calendars }) {
	return filter(calendars.calendars, ['checked', true]);
}
