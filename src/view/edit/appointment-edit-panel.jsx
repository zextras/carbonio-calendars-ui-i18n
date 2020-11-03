import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hooks } from '@zextras/zapp-shell';
import Panel from '../components/panel';
import { closeEditor } from '../../store/editor-slice';
import EditorView from './editor-view';

export default function AppointmentEditPanel({ editorId }) {
	const dispatch = useDispatch();
	const replaceHistory = hooks.useReplaceHistoryCallback();
	const closePanel = useCallback(
		() => {
			replaceHistory('/view');
			dispatch(closeEditor({ id: editorId }));
		},
		[dispatch, editorId, replaceHistory]
	);
	const [title, setTitle] = useState(null);
	return (
		<Panel closeAction={closePanel} title={title} actions={[]} resizable>
			<EditorView setTitle={setTitle} editorId={editorId} panel close={closePanel} />
		</Panel>
	);
};
