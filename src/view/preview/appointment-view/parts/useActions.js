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

import { useMemo } from 'react';
import { hooks } from '@zextras/zapp-shell';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { moveAppointmentToTrash } from '../../../../store/appointments-slice';

export default function useActions({ appointment, invite, close }) {
	const replaceHistory = hooks.useReplaceHistoryCallback();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const actions = useMemo(() => {
		if (appointment) {
			switch (appointment.resource.role) {
				case 'ORGANIZER':
					return [
						{
							id: 'Edit',
							icon: 'EditOutline',
							label: 'Edit',
							click: () => {
								replaceHistory({ pathname: '/view', search: `edit=${appointment.resource.id}` });
							}
						},
						{
							id: 'Delete',
							icon: 'Trash2Outline',
							label: 'Delete',
							click: () => {
								dispatch(moveAppointmentToTrash({
									inviteId: appointment.resource.inviteId,
									t,
								})).then(() => close());
							}
						},
					];
				case 'ATTENDEE':
					return [];
				default:
				case 'VISITOR':
					return [];
			}
		}
		return [];
	}, [appointment, replaceHistory, dispatch, t, close]);

	return actions;
}
