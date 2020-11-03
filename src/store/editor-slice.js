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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import produce from 'immer';
import { merge } from 'lodash';
import { selectAccounts } from './accounts-slice';

/* eslint no-param-reassign: "off" */

function initAppointment({ id, calendar, account }) {
	return ({
		title: '',
		start: Date.now(),
		end: Date.now() + 3600,
		allDay: false,
		resource: {
			attendees: [],
			alarm: [{
				actions: 'DISPLAY',
				trigger: {
					rel: {
						m: 5,
						neg: '1',
						related: 'START'
					}
				}
			}],
			id,
			idx: 0,
			iAmOrganizer: true,
			start: Date.now(),
			calendarId: calendar ? calendar.zid : null,
			calendarColor: calendar ? calendar.color : null,
			calendarName: calendar ? calendar.name : null,
			status: 'CONF',
			location: null,
			neverSent: true,
			organizer: {
				name: account.displayName,
				mail: account.name,
			},
			isPrivate: false,
			class: 'PUB',
			role: 'ORGANIZER',
			inviteNeverSent: true,
			hasOtherAttendees: false,
			hasAlarm: true,
			fragment: null,
		},
	});
}

function addAppointmentEditorReducer(state, { payload }) {
	state.editors[payload.id] = payload.appointment;
	if (payload.panel) {
		if (state.editorPanel !== payload.id) {
			// This discards any unsaved edits in the previous panel
			state.editors[state.editorPanel] = undefined;
		}
		state.editorPanel = payload.id;
	}
}

function editAppointmentDataReducer(state, { payload }) {
	state.editors[payload.id] = merge(state.editors[payload.id], payload.mod);
}

function closeEditorReducer(state, { payload }) {
	state.editors[payload.id] = undefined;
	if (payload.id === state.editorPanel) state.editorPanel = null;
}

export const createAppointment = createAsyncThunk('editor/createAppointment', ({ id, panel, calendar }, { getState }) => {
	const accounts = selectAccounts(getState());
	return {
		id,
		panel,
		appt: initAppointment({ id, calendar, account: accounts[0] })
	};
});

function handleCreateAppointmentFulfilled(state, { payload }) {
	const { id, appt, panel } = payload;
	state.editors[id] = appt;
	if (panel) {
		state.editorPanel = payload.id;
	}
}

export const editorSlice = createSlice({
	name: 'editor',
	initialState: {
		status: 'idle',
		editors: {},
		editorPanel: null
	},
	reducers: {
		addAppointmentEditor: produce(addAppointmentEditorReducer),
		editAppointmentData: produce(editAppointmentDataReducer),
		closeEditor: produce(closeEditorReducer)
	},
	extraReducers: {
		[createAppointment.fulfilled]: produce(handleCreateAppointmentFulfilled),
	}
});

export const {
	addAppointmentEditor, editAppointmentData, closeEditor
} = editorSlice.actions;

export default editorSlice.reducer;

/*
editor: {
	original: Appointment
	current: Appointment
}
*/
