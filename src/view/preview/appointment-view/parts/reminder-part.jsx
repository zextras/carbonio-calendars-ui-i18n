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

import {
	Icon, Padding, Container, Text, Divider
} from '@zextras/zapp-ui';
import React from 'react';

export default function ReminderPart({ alarm }) {
	if (!alarm) return null;
	return (
		<Container
			orientation="horizontal"
			mainAlignment="flex-start"
			crossAlignment="center"
			width="fill"
			height="fit"
			padding={{ horizontal: 'large', vertical: 'medium' }}
		>
			<Icon icon="ClockOutline" color="primary" />
			<Padding all="small">
				<Text color="primary" size="big">
					{' '}
					{ alarm }
					{' '}
				</Text>
			</Padding>
		</Container>
	);
}
