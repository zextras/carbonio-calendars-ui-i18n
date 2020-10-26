import React, { lazy, useMemo } from 'react';
import {
	setRoutes,
	setMainMenuItems,
	setAppContext
} from '@zextras/zapp-shell';
import { Provider } from 'react-redux';
import { report } from './commons/report-exception';

import createStore from './store/create-store';
import { startSync } from './store/sync-slice';
import SetMainMenuItems from './secondary-bar/set-main-menu-items';

const lazyCalendarView = lazy(() => (import(/* webpackChunkName: "calendar-view" */ './view/calendar-view')));

export default function App() {
	console.log('Hello from calendar');
	window.onerror = (msg, url, lineNo, columnNo, error) => {
		report(error);
	};

	const store = useMemo(() => {
		const s = createStore();
		s.dispatch(startSync());

		setAppContext({
			store: s
		});

		setRoutes([
			{
				route: '/view',
				view: lazyCalendarView
			},
		]);

		return s;
	}, []);

	return (
		<Provider
			store={store}
		>
			<SetMainMenuItems />
		</Provider>
	);
}
