/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["cache"] }] */
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
	reduce, pullAllWith, forEach, takeWhile, find, startsWith, findIndex
} from 'lodash';
import moment from 'moment';
import {
	findCalendars,
	selectAllCheckedCalendarsQuery,
	selectCalendar,
} from './calendars-slice';
import { selectAccounts } from './accounts-slice';

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

function getMp({ t, fullInvite }) {
	const meetingCanceled = `${t('The following meeting has been cancelled')}:`;

	const mp = {
		ct: 'multipart/alternative',
		mp: [
			{
				ct: 'text/plain',
				content: `${meetingCanceled}\n\n${fullInvite.desc ? fullInvite.desc[0]._content : ''}`,
			},
		]
	};
	if (fullInvite.descHtml) {
		mp.mp.push({
			ct: 'text/html',
			content: `<html><h3>${meetingCanceled}</h3><br/><br/>${fullInvite.descHtml[0]._content.slice(6)}`,
		});
	}
	return mp;
}

function getParticipants(participants) {
	return participants.map((p) => ({
		a: p.email,
		p: p.name,
		t: 't'
	}));
}

function createMessageForDelete({ invite, t }) {
	return {
		e: getParticipants(Object.entries(invite.participants).flatMap(([_, value]) => value)),
		su: `${t('Cancelled')}: ${invite.fullInvite.name}`,
		mp: getMp({ t, fullInvite: invite.fullInvite }),
	};
}


function createRequest({ appt, id, account }) {
	const isNew = startsWith(id, 'new');
	return [
		isNew ? 'CreateAppointment' : 'ModifyAppointment',
		{
			id: isNew ? null : appt.resource.inviteId,
			m: {
				su: appt.title,
				l: appt.resource.calendarId,
				inv: {
					comp: [{
						alarm: appt.hasAlarm ? [{
							action: 'DISPLAY',
							trigger: {
								rel: {
									m: appt.alarm,
									related: 'START',
									neg: '1'
								}
							}
						}] : undefined,
						at: [],
						allDay: appt.allDay ? '1' : '0',
						fb: appt.resource.freeBusy,
						loc: appt.resource.location,
						name: appt.title,
						or: {
							a: account.name,
							d: account.displayName
						},
						status: appt.resource.status,
						s: {
							d: moment(appt.start).utc().format('YYYYMMDD[T]HHmmss[Z]')
						},
						e: {
							d: moment(appt.end).utc().format('YYYYMMDD[T]HHmmss[Z]')
						},
						class: appt.resource.class
					}]
				}
			},
			_jsns: 'urn:zimbraMail',
		},
		isNew
	];
}

export const saveAppointment = createAsyncThunk('editor/saveAppointment', async ({ id }, { getState, dispatch }) => {
	const appt = getState().editor.editors[id];
	const accounts = selectAccounts(getState());
	const [reqType, body, isNew] = createRequest({ appt, id, account: accounts });
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	dispatch(updateAppointment({ appt, isNew }));
	const resp = await network.soapFetch(reqType, body);
	return { resp, isNew, id };
});

export function handleSaveAppointmentPending(state, action) {
	state.status = 'syncing';
}

export function handleSaveAppointmentFulfilled(state, { payload }) {
	state.status = 'succeeded';
	if (payload.isNew) {
		const index = findIndex(state.cache, ['resource.id', payload.id]);
		state.cache[index].resource.id = payload.resp.apptId;
		state.cache[index].resource.inviteId = payload.resp.invId;
	}
}

export function handleSaveAppointmentRejected(state, { payload }) {
	state.status = 'failed';
	// state.error = action.error.message
}

function normalizeAppointmentInstance(appt, inst, idx, calendar) {
	let role;
	if (appt.isOrg) role = 'ORGANIZER';
	else role = calendar.owner ? 'VISITOR' : 'ATTENDEE';
	// eslint-disable-next-line no-nested-ternary
	const alarm = (inst.alarm && inst.alarm.length > 0)
		? inst.alarm[0].trigger.rel.m
		: (appt.alarm && appt.alarm.length > 0)
			? appt.alarm[0].trigger.rel.m
			: null;
	return ({
		title: inst.name || appt.name,
		start: inst.s,
		end: inst.s + (inst.dur || appt.dur),
		allDay: inst.allDay || appt.allDay || false,
		resource: {
			iAmOrganizer: appt.isOrg,
			isException: inst.ex || false,
			start: appt.d,
			id: appt.id,
			uid: appt.uid,
			idx,
			calendarId: calendar.zid,
			calendarColor: calendar.color,
			calendarName: calendar.name,
			inviteId: appt.invId,
			status: inst.status || appt.status,
			location: inst.loc || appt.loc,
			fragment: inst.fr || appt.fr,
			neverSent: inst.neverSent || appt.neverSent,
			isPrivate: (inst.class || appt.class) === 'PRI', // to deprecate
			class: inst.class || appt.class, // use this instead
			organizer: {
				name: appt.or.d,
				mail: appt.or.a,
			},
			freeBusy: appt.fb,
			role,
			hasChangesNotNotified: inst.draft || appt.draft || false,
			changesNotNotified: inst.changes || appt.changes,
			inviteNeverSent: inst.neverSent || appt.neverSent || false,
			hasOtherAttendees: inst.otherAtt || appt.otherAtt,
			hasAlarm: !!alarm,
			alarm,
			ridZ: inst.ridZ,
			isRecurrent: appt.recur,
			participationStatus: inst.ptst || appt.ptst,
		}
	});
}

function normalizeAppointmentsFromSearchResults({ appts, getState }) {
	return reduce(
		appts,
		(acc, appt) => {
			const calendar = selectCalendar(getState(), { id: appt.l });
			reduce(
				appt.inst,
				(_acc, inst, idx) => {
					_acc.push(
						normalizeAppointmentInstance(appt, inst, idx, calendar)
					);
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

	const { appt } = await network.soapFetch(
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
		firstSync, folder, deleted, appt
	}, { getState }) => {
		if (!firstSync) {
			return Promise
				.resolve({
					updatedAppointments: [],
					updatedCalendars: [],
					deletedIds: []
				})
				.then((r) => {
					if (folder) {
						r.updatedCalendars = findCalendars(folder[0]);
					}
					return r;
				})
				.then((r) => {
					if (deleted) {
						// Handle deleted appointments
						r.deletedIds = deleted[0].ids.split(',');
					}
					return r;
				})
				.then((r) => {
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
								r.updatedAppointments = fetched;
								return r;
							});
					}
					return r;
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
					(r) => {
						r.resource.calendarColor = calendar.color;
						r.resource.calendarName = calendar.name;
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
					Object.assign(found, appt);
				}
			}
		);
	}
	state.syncing = false;
}

function handleSyncDataRejected(state, action) {
	state.syncing = false;
}

function updateAppointmentReducer({ cache }, { payload }) {
	if (payload.isNew) {
		cache.push(payload.appt);
	}
	else {
		const index = findIndex(cache, ['resource.uid', payload.appt.resource.uid]);
		cache[index] = payload.appt;
	}
}

function handleUpdateParticipationStatus(state, { payload }) {
	const { status, inviteId } = payload;
	const newCache = state.cache.map(
		(el) => (el.resource.inviteId === inviteId
			? { ...el, resource: { ...el.resource, participationStatus: status } }
			: el
		)
	);
	return { ...state, cache: newCache };
}

export const moveAppointmentToTrash = createAsyncThunk('appointments/moveAppointmentToTrash', async ({ inviteId, t }, { getState }) => {
	const state = getState();
	const appointment = state.appointments.cache.filter((app) => app.resource.inviteId === inviteId);
	const invite = state.invites.cache[inviteId];
	const m = createMessageForDelete({ invite, t });
	const response = await network.soapFetch(
		'CancelAppointment',
		{
			_jsns: 'urn:zimbraMail',
			id: inviteId,
			ms: appointment.modifiedSequence,
			rev: appointment.revision,
			comp: 0,
			m
		}
	);
	return { response, inviteId };
});

function moveAppointmentToTrashFulfilled(state, { payload }) {
	state.cache = state.cache.map((r) => {
		if (r.resource.inviteId === payload.inviteId) {
			r.resource.calendarId = '3';
		}
		return r;
	});
}

function moveAppointmentToTrashRejected(state, action) {
	console.error(action);
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
	reducers: {
		updateAppointment: produce(updateAppointmentReducer),
		updateParticipationStatus: produce(handleUpdateParticipationStatus),
	},
	extraReducers: {
		[saveAppointment.pending]: produce(handleSaveAppointmentPending),
		[saveAppointment.fulfilled]: produce(handleSaveAppointmentFulfilled),
		[saveAppointment.rejected]: produce(handleSaveAppointmentRejected),
		[handleSyncData.pending]: produce(handleSyncDataPending),
		[handleSyncData.fulfilled]: produce(handleSyncDataFulfilled),
		[handleSyncData.rejected]: produce(handleSyncDataRejected),
		[setRange.pending]: produce(setRangePending),
		[setRange.fulfilled]: produce(setRangeFulfilled),
		[setRange.rejected]: produce(setRangeRejected),
		[moveAppointmentToTrash.fulfilled]: produce(moveAppointmentToTrashFulfilled),
		[moveAppointmentToTrash.rejected]: produce(moveAppointmentToTrashRejected),
	}
});

export const { updateAppointment, updateParticipationStatus } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
