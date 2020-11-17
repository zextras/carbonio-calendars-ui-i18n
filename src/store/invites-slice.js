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
import { network } from '@zextras/zapp-shell';
import produce from 'immer';
import {
	groupBy, map, uniqBy, filter
} from 'lodash';

const DAY_PER_WEEK = 7;
const HOUR_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;

function createStringOfAlarm(number, unit) {
	return `${number} ${unit} BEFORE`;
}

export function emptyInvite() {
	return {
		participants: [],
		alarm: '',
		status: '',
	};
}

export const getOneInvite = createAsyncThunk('invites/getOne', async ({ inviteId, ridZ }, { getState }) => {
	const { m } = await network.soapFetch(
		'GetMsg',
		{
			_jsns: 'urn:zimbraMail',
			m: {
				html: 1,
				needExp: 1,
				id: inviteId,
				ridZ,
				header: [{
					n: 'List-ID'
				}, {
					n: 'X-Zimbra-DL'
				}, {
					n: 'IN-REPLY-TO'
				}],
				max: 250000,
			}
		}
	);
	return { m: m[0], inviteId };
});

function getOneInvitePending({ cache }, { inviteId }) {
	const prevInvite = cache[inviteId] || emptyInvite();
	cache[inviteId] = { ...prevInvite, status: 'pending' };
}

function normalizeMailPartMapFn(v) {
	const ret = {
		contentType: v.ct,
		size: v.s || 0,
		name: v.part,
	};
	if (v.mp) {
		ret.parts = map(
			v.mp || [],
			normalizeMailPartMapFn
		);
	}
	if (v.filename) ret.filename = v.filename;
	if (v.content) ret.content = v.content;
	if (v.ci) ret.ci = v.ci;
	if (v.cd) ret.disposition = v.cd;
	return ret;
}

function getAlarmToString(alarm) {
	if (alarm && alarm[0] && alarm[0].action === 'DISPLAY') {
		const rel = alarm[0].trigger[0].rel[0];

		if (rel) {
			let [number, unit] = [null, null];
			const seconds = (rel.s || 0)
				+ (rel.m || 0) * SECONDS_PER_MINUTE
				+ (rel.h || 0) * SECONDS_PER_MINUTE * MINUTES_PER_HOUR
				+ (rel.d || 0) * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOUR_PER_DAY
				+ (rel.w || 0) * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOUR_PER_DAY * DAY_PER_WEEK;

			if (seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOUR_PER_DAY * DAY_PER_WEEK) === 0) {
				const weeks = seconds
					/ (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOUR_PER_DAY * DAY_PER_WEEK);
				[number, unit] = [weeks, `WEEK${weeks > 1 ? 'S' : ''}`];
			}
			else if (seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOUR_PER_DAY) === 0) {
				const days = seconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOUR_PER_DAY);
				[number, unit] = [days, `DAY${days > 1 ? 'S' : ''}`];
			}
			else if (seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR) === 0) {
				const hours = seconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR);
				[number, unit] = [hours, `HOUR${hours > 1 ? 'S' : ''}`];
			}
			else if (seconds % SECONDS_PER_MINUTE === 0) {
				const minutes = seconds / SECONDS_PER_MINUTE;
				[number, unit] = [minutes, `MINUTE${minutes > 1 ? 'S' : ''}`];
			}
			else {
				[number, unit] = [seconds, `SECOND${number > 1 ? 'S' : ''}`];
			}
			return createStringOfAlarm(number, unit);
		}
	}
	return null;
}

function getOneInviteFulfilled({ cache }, { payload }) {
	const { m } = payload;
	const receivedInvite = m.inv[0];

	const receivedParticipants = receivedInvite.comp[0].at || [];
	const mappedParticipants = uniqBy(
		map(
			filter(
				receivedParticipants,
				(p) => p.cutype !== 'RES'
			),
			(p) => ({
				name: p.d,
				email: p.a,
				isOptional: p.role === 'OPT' || false,
				response: p.ptst,
			})
		),
		'email'
	);
	const groupedParticipants = groupBy(mappedParticipants, (p) => p.response);

	cache[payload.inviteId] = {
		parts: map(
			m.mp || [],
			normalizeMailPartMapFn
		),
		compNum: receivedInvite.comp[0].compNum,
		fullInvite: receivedInvite.comp[0],
		alarm: getAlarmToString(receivedInvite.comp[0].alarm || null),
		participants: groupedParticipants,
		status: 'complete',
	};
}

function getOneInviteRejected(state, action) {
	// TODO: better handling setting error only in that message
	console.log(action);
	state.status = 'error';
}

export const sendInviteResponse = createAsyncThunk('invites/sendInviteResponse', async ({ inviteId, action, updateOrganizer }, { getState }) => {
	const response = await network.soapFetch(
		'SendInviteReply',
		{
			_jsns: 'urn:zimbraMail',
			id: inviteId,
			compNum: 0,
			verb: action,
			rt: 'r',
			updateOrganizer
		}
	);
	return { response, inviteId, action };
});

function sendInviteResponsePending({ cache }, { inviteId }) {
	cache[inviteId].status = 'pending';
}

function sendInviteResponseFulfilled({ cache }, { payload }) {
	cache[payload.inviteId].status = 'fulfilled';
}

function sendInviteResponseRejected(state, action) {
	// TODO: better handling setting error only in that message
	console.error(action);
	state.status = 'error';
	throw new Error(action);
}

export const invitesSlice = createSlice({
	name: 'invites',
	initialState: {
		cache: {},
		status: 'init',
		error: '',
	},
	reducers: {},
	extraReducers: {
		[getOneInvite.pending]: produce(getOneInvitePending),
		[getOneInvite.fulfilled]: produce(getOneInviteFulfilled),
		[getOneInvite.rejected]: produce(getOneInviteRejected),
		[sendInviteResponse.pending]: produce(sendInviteResponsePending),
		[sendInviteResponse.fulfilled]: produce(sendInviteResponseFulfilled),
		[sendInviteResponse.rejected]: produce(sendInviteResponseRejected)
	},
});

export default invitesSlice.reducer;

export function selectAllInvites({ invites }) {
	return invites.cache;
}
