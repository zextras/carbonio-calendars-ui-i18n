/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, lazy, Suspense, useEffect } from 'react';
import { addRoute, setAppContext, Spinner } from '@zextras/carbonio-shell-ui';
import { useTranslation } from 'react-i18next';
import { MANAGE } from './constants';
import SidebarView from './views/secondary-bar/sidebar';

const LazyAppView = lazy(() => import('./views/app-view'));

const AppView: FC = (props) => (
	<Suspense fallback={<Spinner />}>
		<LazyAppView {...props} />
	</Suspense>
);

const App: FC = () => {
	const [t] = useTranslation();
	useEffect(() => {
		const label1 = t('label.app_name', 'Manage');
		addRoute({
			route: MANAGE,
			position: 3,
			visible: true,
			label: label1,
			primaryBar: 'List',
			secondaryBar: SidebarView,
			appView: AppView
		});
		setAppContext({ hello: 'world' });
	}, [t]);

	return null;
};

export default App;
