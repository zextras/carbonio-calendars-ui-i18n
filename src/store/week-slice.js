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
import moment from 'moment';
import { network } from '@zextras/zapp-shell';
import { filter, reduce } from 'lodash';
import { selectCalendar } from './calendars-slice';

const fetchWeek = createAsyncThunk('calendars/fetchWeek', async ({ currentWeek, currentYear }, { getState }) => {
	const { calendars } = getState().calendars;
	const activeCalendars = reduce(
		filter(calendars, 'checked'),
		(acc, c) => {
			acc.push(`inid:"${c.zid}"`);
			return acc;
		},
		[]
	);
	const week = moment().isoWeek(currentWeek).year(currentYear);
	const { appt, more, offset } = await network.soapFetch(
		'Search',
		{
			_jsns: 'urn:zimbraMail',
			limit: '500',
			calExpandInstEnd: week.endOf('isoWeek').valueOf(),
			calExpandInstStart: week.startOf('isoWeek').valueOf(),
			// locale: {
			//	_content: "it",
			// },
			offset: 0,
			sortBy: 'none',
			types: 'appointment',
			query: {
				_content: activeCalendars.join(' OR ')
			}
		}
	);
	const state = getState();
	const appointments = reduce(
		appt,
		(acc, app) => {
			const calendar = selectCalendar(state, { id: app.l });
			acc.push({
				title: app.name,
				start: moment(app.d).valueOf(),
				end: moment(app.d + app.dur).valueOf(),
				allDay: false,
				resources: {
					id: app.id,
					calendarId: app.l,
					calendarColor: calendar.color,
					inviteId: app.invId,
				}
			});
			return acc;
		},
		[]
	);
	return {
		currentWeek,
		currentYear,
		appointments
	};
});

function fetchWeekPendingReducer(state, { meta }) {
	state.status = 'loading';
	const { currentWeek, currentYear } = meta.arg;
	state.currentWeek = currentWeek;
	state.currentYear = currentYear;
}

function setWeekDataReducer(state, { payload }) {
	const { currentWeek, currentYear, appointments } = payload;
	state.status = 'idle';
	state.currentWeek = currentWeek;
	state.currentYear = currentYear;
	state.weeks[`${currentYear}|${currentWeek}`] = appointments;
}

function fetchWeekErrorReducer(state) {
	state.status = 'error';
}

export const setCurrentWeek = createAsyncThunk('calendars/setCurrentWeek', async (args, { dispatch }) => {
	await dispatch(
		fetchWeek({
			currentWeek: moment().isoWeek(),
			currentYear: moment().year()
		})
	);
});

export const setNextWeek = createAsyncThunk('calendars/setNextWeek', async (args, { getState, dispatch }) => {
	let { currentWeek, currentYear } = getState().weeks;
	if (currentWeek === 52) {
		currentWeek = 1;
		currentYear += 1;
	}
	else {
		currentWeek += 1;
	}
	await dispatch(
		fetchWeek({
			currentWeek,
			currentYear
		})
	);
});

export const setPreviousWeek = createAsyncThunk('calendars/setPreviousWeek', async (args, { getState, dispatch }) => {
	let { currentWeek, currentYear } = getState().weeks;
	if (currentWeek === 1) {
		currentWeek = 52;
		currentYear -= 1;
	}
	else {
		currentWeek -= 1;
	}
	await dispatch(
		fetchWeek({
			currentWeek,
			currentYear
		})
	);
});

export const weekSlice = createSlice({
	name: 'weeks',
	initialState: {
		status: 'init',
		currentYear: moment().year(),
		currentWeek: moment().isoWeek(),
		weeks: {}
	},
	reducers: {},
	extraReducers: {
		[fetchWeek.pending]: produce(fetchWeekPendingReducer),
		[fetchWeek.fulfilled]: produce(setWeekDataReducer),
		[fetchWeek.rejected]: produce(fetchWeekErrorReducer),
	}
});

// export const {  } = weekSlice.actions;

export default weekSlice.reducer;

export function selectCurrentWeek({ weeks }) {
	return weeks.currentWeek;
}

export function selectCurrentYear({ weeks }) {
	return weeks.currentYear;
}

export function selectFetchStatus({ weeks }) {
	return weeks.status;
}

export function selectCurrentWeekAppointments({ weeks }) {
	return weeks.weeks[`${weeks.currentYear}|${weeks.currentWeek}`] || [];
}

/*
const SearchRequest = {
	calExpandInstEnd: 1602453599999,
	calExpandInstStart: 1601848800000,
	limit: "500",
	locale: {
		_content: "it",
	},
	offset: 0,
	query: {
		_content: "inid:\"10\" OR inid:\"5566\" OR inid:\"14024\""
	},
	sortBy: "none",
	types: "appointment",
	_jsns: "urn:zimbraMail"
}
const SearchResponse = {
	more: false,
	offset: 0,
	sortBy: "none",
	_jsns: "urn:zimbraMail",
	appt: [ {
		alarm: true,
		alarmData: [ { nextAlarm: 1602602700000, alarmInstStart: 1602603000000,
			invId: 11954, compNum: 0 } ],
		allDay: false,
		class: "PUB",
		compNum: 0,
		d: 1598338981000,
		draft: false,
		dur: 7200000,
		fb: "B",
		fba: "B",
		fr: "Nuova richiesta di riunione: Oggetto: Corso Organizzatore: \"Human Resources\"" +
		 	"<hr@zextras.com> Ora: Martedì, 13 ottobre 2020, 17:30:00 - ...",
		id: "11955",
		inst: [ { s: 1602603000000, ridZ: "20201013T153000Z" } ],
		invId: "11955-11954",
		isOrg: false,
		l: "10",
		loc: "",
		md: 1598338981,
		ms: 13378,
		name: "Corso",
		neverSent: false,
		or: { a: "hr@zextras.com", url: "hr@zextras.com", d: "Human Resources" },
		otherAtt: true,
		ptst: "AC",
		rev: 13373,
		s: 0,
		status: "CONF",
		transp: "O",
		uid: "d7a02f3c-54e2-4e67-b9d5-f7ff8f3f8f77",
		x_uid: "d7a02f3c-54e2-4e67-b9d5-f7ff8f3f8f77",
	}]
};
*/
