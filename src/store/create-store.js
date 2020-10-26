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

import { configureStore } from '@reduxjs/toolkit';
import calendarsSliceReducer from './calendars-slice';
import syncSliceReducer from './sync-slice';
import weeksSliceReducer from './week-slice';
import appointmentsSliceReducer from './appointments-slice';

export default function createStore() {
	const store = configureStore({
		reducer: {
			appointments: appointmentsSliceReducer,
			calendars: calendarsSliceReducer,
			sync: syncSliceReducer,
			weeks: weeksSliceReducer
		}
	});
	return store;
}
