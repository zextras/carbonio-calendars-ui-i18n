import React from 'react';
import { hooks } from '@zextras/zapp-shell';
import EditorView from './editor-view';
import useQueryParam from '../../commons/useQueryParam';

export default function AppointmentEditBoard() {
	const editorId = useQueryParam('id');
	const closeBoard = hooks.useRemoveCurrentBoard();
	return (
		<EditorView setTitle={console.log} editorId={editorId} panel={false} close={closeBoard} />
	);
};
