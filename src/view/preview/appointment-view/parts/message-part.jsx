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
	Container, Icon, Padding, Text
} from '@zextras/zapp-ui';
import React from 'react';
import BodyMessageRenderer from '../../../components/body-message-renderer';

export default function MessagePart({ fullInvite, inviteId, parts }) {
	return (
		<Container
			orientation="horizontal"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			width="fill"
			height="fit"
			padding={{ horizontal: 'large', vertical: 'medium' }}
		>
			<Icon icon="MessageSquareOutline" />
			<Container
				orientation="vertical"
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				width="fill"
				height="fit"
				padding={{ left: 'small' }}
			>
				<BodyMessageRenderer fullInvite={fullInvite} inviteId={inviteId} parts={parts} />
			</Container>
		</Container>
	);
}
