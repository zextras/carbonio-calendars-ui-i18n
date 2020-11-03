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
	Avatar, Container, IconButton, Row, Text
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useMemo, useState } from 'react';

export default function ParticipantsDisplayer({ participants }) {
	const width = (Object.keys(participants).length === 1) ? '100%' : '50%';
	if (Object.keys(participants).length === 0) return null;
	return (
		<Container
			wrap="wrap"
			orientation="horizontal"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			width="fill"
			heigh="fit"
			padding={{ top: 'small' }}
		>
			<Dropdown label="Accepted" participants={participants.AC} width={width} />
			<Dropdown label="Didn't answer" participants={participants.NE} width={width} />
			<Dropdown label="Tentative" participants={participants.TE} width={width} />
			<Dropdown label="Declined" participants={participants.DE} width={width} />
		</Container>
	);
}

function Dropdown({ label, participants = [], width }) {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(participants.length < 3);
	const toggleExpanded = useCallback(() => setIsExpanded((prevExpanded) => !prevExpanded), []);

	const displayedParticipants = useMemo(() => (
		<Container
			orientation="horizontal"
			mainAlignment="space-between"
			crossAlignment="flex-start"
			wrap="wrap"
			width="fill"
		>
			{participants.map((participant) =>
				<DisplayedParticipant participant={participant} key={participant.email} />)}
		</Container>
	), [participants]);

	return participants.length > 0 && (
		<Container
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			width={width}
			height="fit"
		>
			<Row mainAlignment="flex-start" takeAvailableSpace>
				<Text weight="bold">
					{`${t(label)} (${participants.length})`}
				</Text>
				<IconButton icon={isExpanded ? 'ChevronUp' : 'ChevronDown'} onClick={toggleExpanded} size="small" />
			</Row>
			{isExpanded && displayedParticipants}
		</Container>
	);
}

function DisplayedParticipant({ participant }) {
	const { t } = useTranslation();
	return (
		<Row mainAlignment="flex-start" crossAlignment="center" width="212px" padding={{ vertical: 'small' }}>
			<Avatar label={participant.name || participant.email} />
			<Row mainAlignment="flex-start" crossAlignment="center" takeAvailableSpace padding={{ left: 'small' }}>
				<Text overflow="ellipsis">
					{participant.name || participant.email}
					<br />
					<Text size="small" color="secondary">
						{`(${participant.isOptional ? t('Optional') : t('Required')})`}
					</Text>
				</Text>
			</Row>
		</Row>
	);
}
