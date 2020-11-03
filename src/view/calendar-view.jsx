import React, {
	Suspense, lazy, useEffect, useState, useCallback
} from 'react';
import { Container, Text } from '@zextras/zapp-ui';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import CalendarStyle from './calendar/calendar-style';
import {
	selectStatus,
	selectSyncStatus,
	setRange,
} from '../store/appointments-slice';
import {
	selectAllFolders,
} from '../store/calendars-slice';
import useQueryParam from '../commons/useQueryParam';
import AppointmentView from './preview/appointment-view/appointment-view';
import AppointmentEditPanel from './edit/appointment-edit-panel';

const CalendarComponent = lazy(() => import(/* webpackChunkName: "calendar-component" */ './calendar/calendar-component'));

export default function CalendarView() {
	const [appointmentDetail, setAppointmentDetail] = useState(null);
	const closeAppointmentDetail = useCallback(() => {
		setAppointmentDetail(null);
	}, []);
	const openAppointmentDetail = useCallback((appointment) => {
		setAppointmentDetail(appointment);
	}, []);

	const editorId = useQueryParam('edit');

	return (
		<Container background="gray6" padding={{ all: 'medium' }} style={{ overflowY: 'auto', position: 'relative' }}>
			<UglyNonRenderingComponent />
			<CalendarStyle />
			<Suspense fallback={<Text>Loading...</Text>}>
				<CalendarComponent openAppointmentDetail={openAppointmentDetail} />
			</Suspense>
			{appointmentDetail && !editorId
			&& (
				<AppointmentView
					inviteId={appointmentDetail.resource.inviteId}
					idx={appointmentDetail.resource.idx}
					close={closeAppointmentDetail}
				/>
			)}
			{editorId
			&& (
				<AppointmentEditPanel editorId={editorId} />
			)}
		</Container>
	);
}

const UglyNonRenderingComponent = () => {
	const calendars = useSelector(selectAllFolders);
	const syncing = useSelector(selectSyncStatus);
	const status = useSelector(selectStatus);

	const dispatch = useDispatch();

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
