import React, { Suspense, lazy, useEffect } from 'react';
import { Container, Text } from '@zextras/zapp-ui';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import CalendarStyle from './calendar/calendar-style';
import StoreProvider from '../store/store-provider';
import {
	selectStatus,
	selectSyncStatus,
	setRange,
} from '../store/appointments-slice';
import {
	selectAllFolders,
} from '../store/calendars-slice';

const CalendarComponent = lazy(() => import(/* webpackChunkName: "calendar-component" */ './calendar/calendar-component'));

export default function CalendarView() {
	return (
		<StoreProvider>
			<Container background="gray6" padding={{ all: 'medium' }} style={{ overflowY: 'auto' }}>
				<UglyNonRenderingComponent />
				<CalendarStyle />
				<Suspense fallback={<Text>Loading...</Text>}>
					<CalendarComponent />
				</Suspense>
			</Container>
		</StoreProvider>
	);
}

const UglyNonRenderingComponent = () => {
	const calendars = useSelector(selectAllFolders);
	const syncing = useSelector(selectSyncStatus);
	const status = useSelector(selectStatus);

	const dispatch = useDispatch();

	console.log(calendars, syncing, status);

	useEffect(() => {
		if (!isEmpty(calendars) && status === 'init') {
			const now = moment();
			dispatch(setRange({
				start: now.startOf('isoWeek').valueOf(),
				end: now.endOf('isoWeek').valueOf(),
			}));
		}
	}, [dispatch, status, calendars]);
	return null;
};
