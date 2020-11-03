import React, { lazy, useEffect } from 'react';
import {
	setRoutes,
	setCreateOptions,
	store,
	hooks
} from '@zextras/zapp-shell';
import { combineReducers } from '@reduxjs/toolkit';

import { report } from './commons/report-exception';
import syncSliceReducer, { startSync } from './store/sync-slice';
import SetMainMenuItems from './secondary-bar/set-main-menu-items';
import appointmentsSliceReducer from './store/appointments-slice';
import calendarsSliceReducer from './store/calendars-slice';
import weeksSliceReducer from './store/week-slice';
import editorSliceReducer from './store/editor-slice';
import invitesSliceReducer from './store/invites-slice';
import accountsSliceReducer, { setAccounts } from './store/accounts-slice';

const lazyCalendarView = lazy(() => (import(/* webpackChunkName: "calendar-view" */ './view/calendar-view')));
const lazyEditorView = lazy(() => (import(/* webpackChunkName: "calendar-edit" */ './view/edit/appointment-edit-board')));

export default function App() {
	console.log('Hello from calendar');
	window.onerror = (msg, url, lineNo, columnNo, error) => {
		report(error);
	};

	useEffect(() => {
		store.setReducer(
			combineReducers({
				accounts: accountsSliceReducer,
				appointments: appointmentsSliceReducer,
				calendars: calendarsSliceReducer,
				sync: syncSliceReducer,
				weeks: weeksSliceReducer,
				editor: editorSliceReducer,
				invites: invitesSliceReducer,
			})
		);
	}, []);

	useEffect(() => {
		store.store.dispatch(startSync());

		setRoutes([
			{
				route: '/view',
				view: lazyCalendarView
			},
			{
				route: '/edit',
				view: lazyEditorView
			},
		]);

		setCreateOptions([{
			id: 'create-appointment',
			label: 'New Appointment',
			app: {
				boardPath: '/edit?id=new',
				path: '/view?edit=new'
			}
		}]);
	}, []);

	const accounts = hooks.useUserAccounts();
	useEffect(() => {
		store.store.dispatch(
			setAccounts(accounts)
		);
	}, [accounts]);

	return (
		<SetMainMenuItems />
	);
}
