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
import { Avatar, Container } from '@zextras/zapp-ui';
import styled from 'styled-components';

const OuterContainer = styled(Container)`
	height: 80px;
	background: linear-gradient(0.25turn, ${(props) => props.color}, #FFFFFF);
`;

const IconContainer = styled(Avatar)`
	position: relative;
	bottom: -16px;
	z-index: 12;
  background-color: ${(props) => props.color};
`;

export default function ImageAndIconPart({ icon = 'CalendarOutline', color }) {
	return (
		<OuterContainer color={color}>
			<IconContainer icon={icon} color={color} label="" size="large" />
		</OuterContainer>
	);
}
