import React, {
	useCallback, useEffect, useMemo, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container } from '@zextras/zapp-ui';
import { find } from 'lodash';
import {
	addAppointmentEditor, createAppointment, editAppointmentData
} from '../../store/editor-slice';
import {
	saveAppointment
} from '../../store/appointments-slice';
import EditorButtons from './editor-buttons';
import DataRecap from './data-recap';
import InputRow from './input-row';
import { selectAllFolders } from '../../store/calendars-slice';
import DatePicker from './date-picker';
import AppointmentDetails from './appointment-details';

let counter = 0;

const getNewEditId = (editorId) => {
	counter += 1;
	return `${editorId}-${counter}`;
};

const useId = (editorId, panel) => {
	const dispatch = useDispatch();

	const [id, setId] = useState(editorId);
	const calendars = useSelector(selectAllFolders);
	const original = useSelector(({ appointments }) => find(appointments.cache, ['resource.id', editorId]));
	useEffect(() => {
		const newId = getNewEditId(editorId);
		if (editorId === 'new') {
			dispatch(createAppointment({
				id: newId,
				panel,
				calendar: calendars['10']
			}));
		}
		else {
			dispatch(addAppointmentEditor({
				id: newId,
				panel,
				appointment: original
			}));
		}
		setId(newId);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorId]);

	const data = useSelector(({ editor }) => editor.editors[id]);
	return { id, data, original };
};

const useEditorDispatches = (id, close) => {
	const dispatch = useDispatch();
	const onSubjectChange = useCallback(
		(e) => {
			dispatch(editAppointmentData({ id, mod: { title: e.target.value } }));
		},
		[dispatch, id]
	);
	const onLocationChange = useCallback(
		(e) => dispatch(editAppointmentData({ id, mod: { resource: { location: e.target.value } } })),
		[dispatch, id]
	);
	const onSave = useCallback(
		() => {
			dispatch(saveAppointment({ id }));
			close();
		},
		[close, dispatch, id]
	);
	const onDateChange = useCallback(
		(mod) => dispatch(editAppointmentData({ id, mod })), [dispatch, id]
	);
	const onPrivateChange = useCallback(
		(isPrivate) => dispatch(editAppointmentData({ id, mod: { resource: { class: isPrivate ? 'PRI' : 'PUB', isPrivate } } })),
		[dispatch, id]
	);
	const onCalendarChange = useCallback(
		(calendar) => dispatch(editAppointmentData({
			id,
			mod: {
				resource: {
					calendarId: calendar.zid,
					calendarName: calendar.name,
					calendarColor: calendar.color
				}
			}
		})),
		[dispatch, id]
	);
	const onDisplayStatusChange = useCallback(
		(freeBusy) => dispatch(editAppointmentData({ id, mod: { resource: { freeBusy } } })),
		[dispatch, id]
	);
	const onReminderChange = useCallback(
		(value) => dispatch(editAppointmentData({
			id,
			mod: {
				resource: (value === 'never')
					? { alarm: null, hasAlarm: false }
					: { alarm: value, hasAlarm: true }
			}
		})),
		[dispatch, id]
	);
	const onAllDayChange = useCallback(
		(allDay) => dispatch(editAppointmentData({ id, mod: { allDay } })),
		[dispatch, id]
	);
	return {
		onPrivateChange,
		onCalendarChange,
		onDisplayStatusChange,
		onReminderChange,
		onSubjectChange,
		onLocationChange,
		onSave,
		onDateChange,
		onAllDayChange
	};
};

export default function EditorView({
	editorId, setTitle, panel, close
}) {
	const { id, data, original } = useId(editorId, panel);
	const { t } = useTranslation();
	const callbacks = useEditorDispatches(id, close);
	const title = useMemo(() => ((data && data.title !== '') ? data.title : 'No Subject'), [data]);
	useEffect(() => {
		setTitle(title);
	}, [title, setTitle]);
	return (
		<Container mainAlignment="flex-start" crossAlignment="flex-start">
			{data && (
				<>
					<EditorButtons onSave={callbacks.onSave} />
					<DataRecap data={data} />
					<InputRow
						label={t('Subject')}
						defaultValue={data.title}
						onChange={callbacks.onSubjectChange}
					/>
					<InputRow
						label={t('Location')}
						defaultValue={data.resource.location}
						onChange={callbacks.onLocationChange}
					/>
					{/* <AttendeesInput
						background="gray5"
						onChange={console.log}
					/> */}
					<DatePicker
						start={data.start}
						end={data.end}
						allDay={data.allDay}
						onChange={callbacks.onDateChange}
						onAllDayChange={callbacks.onAllDayChange}
					/>
					<AppointmentDetails
						data={data}
						onPrivateChange={callbacks.onPrivateChange}
						onCalendarChange={callbacks.onCalendarChange}
						onDisplayStatusChange={callbacks.onDisplayStatusChange}
						onReminderChange={callbacks.onReminderChange}
					/>
				</>
			)}
		</Container>
	);
}
