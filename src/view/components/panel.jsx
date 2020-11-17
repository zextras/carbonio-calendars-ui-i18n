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
import React, {
	useRef, useEffect, useMemo, useState
} from 'react';
import styled from 'styled-components';
import {
	IconButton, useHiddenCount, Row, Dropdown, Container, Text, Icon
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { map, slice } from 'lodash';

function ActionButtons({ actions, closeAction }) {
	const actionContainerRef = useRef();
	const [hiddenActionsCount, recalculateHiddenActions] = useHiddenCount(actionContainerRef, true);

	useEffect(() => {
		recalculateHiddenActions();
	}, [actions, recalculateHiddenActions]);

	return (
		<Row
			wrap="nowrap"
			height="100%"
			mainAlignment="flex-end"
			style={{ maxWidth: '160px' }}
		>
			<Row
				ref={actionContainerRef}
				height="40px"
				mainAlignment="flex-start"
				style={{ overflow: 'hidden' }}
			>
				{actions && map(
					actions,
					(action) => <IconButton key={action.id} icon={action.icon} onClick={action.click} />
				)}
			</Row>
			{hiddenActionsCount > 0 && (
				<Dropdown
					style={{ flexGrow: '1' }}
					items={slice(actions, -hiddenActionsCount)}
				>
					<IconButton icon="MoreVertical" />
				</Dropdown>
			)}
			<IconButton icon="Close" onClick={closeAction} />
		</Row>
	);
}

const AppointmentCardContainer = styled(Container)`
	z-index: 10;
	position: absolute;
	top: 68px;
	right: 12px;
	bottom: 12px;
	left: ${({ expanded }) => (expanded ? '12px' : 'max(calc(100% - 512px), 12px)')};
	transition: left 0.2s ease-in-out;
	height: auto;
	width: auto;
	box-shadow: 0px 0px 8px 0px rgba(128,128,128,1);
`;

function Header({ title, closeAction, actions }) {
	const { t } = useTranslation();
	return (
		<Row mainAlignment="flex-start" orientation="horizontal" width="fill" background="gray4">
			<Row padding={{ all: 'medium' }}>
				<Icon icon="CalendarOutline" />
			</Row>
			<Row takeAvailableSpace mainAlignment="flex-start">
				<Text weight="bold" size="large" overflow="ellipsis">{ title || t('No Subject') }</Text>
			</Row>
			<ActionButtons actions={actions} closeAction={closeAction} />
		</Row>
	);
}

export default function Panel({
	children, title, actions, closeAction, resizable
}) {
	const [expanded, setExpanded] = useState(false);
	const actionsWithExpand = useMemo(() => (resizable ? [{
		id: 'expand',
		icon: expanded ? 'Collapse' : 'Expand',
		label: '',
		click: () => setExpanded((e) => !e)
	}, ...actions] : actions), [actions, expanded, resizable]);
	return (
		<AppointmentCardContainer background="gray6" mainAlignment="flex-start" expanded={expanded}>
			<Header title={title} actions={actionsWithExpand} closeAction={closeAction} />
			{children}
		</AppointmentCardContainer>
	);
}
