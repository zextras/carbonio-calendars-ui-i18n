/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, Suspense } from 'react';
import { Container, Text } from '@zextras/carbonio-design-system';
import { Spinner } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';

const AppView: FC = () => {
	const [t] = useTranslation();
	return (
		<Container orientation="horizontal" mainAlignment="flex-start">
			<Container width="40%">
				<Text>Manage part-1</Text>
			</Container>
			<Suspense fallback={<Spinner />}>
				<Container width="60%">
					<Text>Manage part-2</Text>
				</Container>
			</Suspense>
		</Container>
	);
};

export default AppView;
