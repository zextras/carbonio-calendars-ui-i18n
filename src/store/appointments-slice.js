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
import { network } from '@zextras/zapp-shell';
import {
	reduce, pullAllWith, forEach, takeWhile, find
} from 'lodash';
import {
	findCalendars,
	selectAllCheckedCalendarsQuery,
	selectCalendar,
} from './calendars-slice';

/* eslint no-param-reassign: "off" */

function normalizeAppointmentsFromSearchResults({ appts, getState }) {
	return reduce(
		appts,
		(acc, appt) => {
			const calendar = selectCalendar(getState(), { id: appt.l });
			reduce(
				appt.inst,
				(_acc, inst, idx) => {
					_acc.push({
						title: appt.name,
						start: inst.s,
						end: inst.s + appt.dur,
						allDay: appt.allDay || false,
						resource: {
							iAmOrganizer: appt.isOrg,
							start: appt.d,
							id: appt.id,
							uid: appt.uid,
							idx,
							calendarId: appt.l,
							calendarColor: calendar.color,
							calendarName: calendar.name,
							inviteId: appt.invId,
							status: appt.status,
							location: appt.loc,
							fragment: appt.fr,
							neverSent: appt.neverSent,
							organizer: appt.or,
							isPrivate: appt.class === 'PRI'
						}
					});
					return _acc;
				},
				acc
			);
			return acc;
		},
		[]
	);
}

function fetchUpdatedAppointments({
	apptsUpdates, start, end, getState
}) {
	if (apptsUpdates.length < 1) {
		return Promise.resolve({});
	}
	const SearchRequest = {
		_jsns: 'urn:zimbraMail',
		types: 'appointment',
		limit: '500',
		calExpandInstEnd: end,
		calExpandInstStart: start,
		// locale: {
		//	_content: "it",
		// },
		offset: 0,
		sortBy: 'none',
		query: {
			_content: reduce(
				apptsUpdates,
				(acc, appt) => {
					acc.push(`(inid:"${appt.l}" AND item:"${appt.id}")`);
					return acc;
				},
				[]
			).join(' OR ')
		}
	};
	return network.soapFetch(
		'Search',
		SearchRequest
	)
		.then(
			({ appt }) => normalizeAppointmentsFromSearchResults({ appts: appt, getState })
		);
}

export const setRange = createAsyncThunk('appointments/setRange', async ({ start, end }, { getState }) => {
	const cacheStart = selectStart(getState());
	const cacheEnd = selectEnd(getState());
	let spanStart = (start < cacheStart) ? start : cacheStart;
	let spanEnd = (cacheEnd < end) ? end : cacheEnd;
	let method;
	const overlap = start < cacheStart && cacheEnd < end;
	if (!overlap) {
		if (start < cacheStart) {
			spanStart = start;
			spanEnd = cacheStart;
			method = 'begin';
		}
		else if (cacheEnd < end) {
			spanStart = cacheEnd;
			spanEnd = end;
			method = 'end';
		}
	}
	else {
		method = 'replace';
	}

	const { appt, more, offset } = await network.soapFetch(
		'Search',
		{
			_jsns: 'urn:zimbraMail',
			limit: '500',
			calExpandInstEnd: spanEnd,
			calExpandInstStart: spanStart,
			// locale: {
			//	_content: "it",
			// },
			offset: 0,
			sortBy: 'none',
			types: 'appointment',
			query: {
				_content: selectAllCheckedCalendarsQuery(getState())
			}
		}
	);

	const appointments = normalizeAppointmentsFromSearchResults({ appts: appt, getState });
	return {
		spanStart,
		spanEnd,
		method,
		appointments
	};
});

function setRangePending(state, { meta }) {
	const cacheStart = state.start;
	const cacheEnd = state.end;
	const { start, end } = meta.arg;
	if (start < cacheStart || cacheEnd < end) {
		state.status = 'loading';
	}
}

function setRangeFulfilled(state, { payload }) {
	const {
		spanStart,
		spanEnd,
		method,
		appointments
	} = payload;
	switch (method) {
		case 'begin':
			state.start = spanStart;
			state.cache = [...appointments, ...state.cache];
			break;
		case 'end':
			state.end = spanEnd;
			state.cache = [...state.cache, ...appointments];
			break;
		case 'replace':
		default:
			state.start = spanStart;
			state.end = spanEnd;
			state.cache = appointments;
			break;
	}
	state.status = 'idle';
}

function setRangeRejected(state, { error }) {
	state.status = 'error';
	state.error = error;
}

export const handleSyncData = createAsyncThunk(
	'appointments/handleSyncData',
	({
		firstSync, token, folder, deleted, appt
	}, { getState }) => {
		if (!firstSync) {
			return Promise
				.resolve({
					updatedAppointments: [],
					updatedCalendars: [],
					deletedIds: []
				})
				.then((returnData) => {
					if (folder) {
						returnData.updatedCalendars = findCalendars(folder[0]);
					}
					return returnData;
				})
				.then((returnData) => {
					if (deleted) {
						// Handle deleted appointments
						returnData.deletedIds = deleted[0].ids.split(',');
					}
					return returnData;
				})
				.then((returnData) => {
					if (appt) {
						// Handle new or updated appointments
						const start = selectStart(getState());
						const end = selectEnd(getState());
						// Removing all appointments into unchecked calendars
						// const uncheckedCalendars = selectUncheckedCalendars(getState());
						// const pruned = pullAllWith(appt, uncheckedCalendars, ({ l }, { zid }) => l === zid);
						return fetchUpdatedAppointments({
							apptsUpdates: appt,
							start,
							end,
							getState
						})
							.then((fetched) => {
								returnData.updatedAppointments = fetched;
								return returnData;
							});
					}
					return returnData;
				});
		}

		return Promise.resolve({
			updatedAppointments: [],
			updatedCalendars: [],
			deletedIds: []
		});
	}
);

function handleSyncDataPending(state, action) {
	state.syncing = true;
}

function handleSyncDataFulfilled(state, { payload }) {
	const {
		updatedAppointments,
		updatedCalendars,
		deletedIds
	} = payload;
	if (deletedIds && deletedIds.length > 0) {
		state.cache = pullAllWith(
			state.cache,
			deletedIds,
			({ resource }, id) => resource.id === id
		);
	}
	if (updatedCalendars && updatedCalendars.length > 0) {
		forEach(
			updatedCalendars,
			(calendar) => {
				forEach(
					takeWhile(
						state.cache,
						({ resource }) => resource.calendarId === calendar.zid
					),
					(appt) => {
						appt.resource.calendarColor = calendar.color;
						appt.resource.calendarName = calendar.name;
					}
				);
			}
		);
	}
	if (updatedAppointments && updatedAppointments.length > 0) {
		forEach(
			updatedAppointments,
			(appt) => {
				const found = find(
					state.cache,
					({ resource }) => (
						resource.id === appt.resource.id
						&& resource.inviteId === appt.resource.inviteId
						&& resource.idx === appt.resource.idx
					)
				);
				if (!found) {
					state.cache.push(appt);
				}
				else {
					found.resource = appt.resource;
					found.allDay = appt.allDay;
					found.start = appt.start;
					found.end = appt.end;
					found.title = appt.title;
				}
			}
		);
	}
	state.syncing = false;
}

function handleSyncDataRejected(state, action) {
	state.syncing = false;
}

export const appointmentsSlice = createSlice({
	name: 'appointments',
	initialState: {
		syncing: false,
		status: 'init',
		start: Number.POSITIVE_INFINITY,
		end: Number.NEGATIVE_INFINITY,
		cache: [],
	},
	reducers: {},
	extraReducers: {
		[handleSyncData.pending]: produce(handleSyncDataPending),
		[handleSyncData.fulfilled]: produce(handleSyncDataFulfilled),
		[handleSyncData.rejected]: produce(handleSyncDataRejected),
		[setRange.pending]: produce(setRangePending),
		[setRange.fulfilled]: produce(setRangeFulfilled),
		[setRange.rejected]: produce(setRangeRejected),
	}
});

// export const {  } = weekSlice.actions;

export default appointmentsSlice.reducer;

export function selectStart({ appointments }) {
	return appointments.start;
}

export function selectEnd({ appointments }) {
	return appointments.end;
}

export function selectStatus({ appointments }) {
	return appointments.status;
}

export function selectAllAppointments({ appointments }) {
	return appointments.cache;
}

export function selectSyncStatus({ appointments }) {
	return appointments.syncing;
}
