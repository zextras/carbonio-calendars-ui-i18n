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
import React from 'react';
import CalendarsList from './calendars-list';
import StoreProvider from '../store/store-provider';
import WeekViewList from './week-view-list';
import AppointmentsList from './appointments-list';

export default function CalendarWeekView() {
	return (
		<StoreProvider>
			<CalendarsList />
			<AppointmentsList />
			{/* <WeekViewList /> */}
		</StoreProvider>
	);
}
