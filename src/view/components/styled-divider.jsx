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

import styled from 'styled-components';

const StyledDivider = styled.hr`
  border: 0px;
  height: 0px;
  border-top: 1px solid ${(props) => props.theme.palette.gray2.regular};
  width: calc(100% - 32px);
  margin: 0px;
`;

export default StyledDivider;
