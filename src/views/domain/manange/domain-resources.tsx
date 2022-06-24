/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
	Container,
	Row,
	IconButton,
	Divider,
	Button,
	Padding,
	Icon,
	Input,
	Table,
	Text
} from '@zextras/carbonio-design-system';
import { Trans, useTranslation } from 'react-i18next';
import moment from 'moment';
import logo from '../../../assets/gardian.svg';
import Paginig from '../../components/paging';
import { searchDirectory } from '../../../services/search-directory-service';

const DomainResources: FC = () => {
	const [t] = useTranslation();
	const [resourceList, setResourceList] = useState<any[]>([]);
	const [offset, setOffset] = useState<number>(0);
	const [limit, setLimit] = useState<number>(50);
	const [totalAccount, setTotalAccount] = useState<number>(0);
	const headers: any[] = useMemo(
		() => [
			{
				id: 'resource',
				label: t('label.resource', 'Resource'),
				width: '20%',
				bold: true
			},
			{
				id: 'email',
				label: t('label.email', 'Email'),
				width: '25%',
				bold: true
			},
			{
				id: 'status',
				label: t('label.status', 'Status'),
				width: '15%',
				bold: true
			},
			{
				id: 'last_access',
				label: t('label.last_access', 'Last Access'),
				width: '15%',
				bold: true
			},
			{
				id: 'description',
				label: t('label.description', 'Description'),
				width: '25%',
				bold: true
			}
		],
		[t]
	);

	const getResourceList = useCallback((): void => {
		const attrs =
			'displayName,zimbraId,zimbraMailHost,uid,description,zimbraIsAdminGroup,zimbraMailStatus,zimbraIsDelegatedAdminAccount,zimbraIsAdminAccount,zimbraIsSystemResource,zimbraIsSystemAccount,zimbraIsExternalVirtualAccount,zimbraLastLogonTimestamp,zimbraAccountStatus';
		const types = 'resources';
		const query = '(&(!(zimbraIsSystemAccount=TRUE)))';

		searchDirectory(attrs, types, '', query, offset, limit, 'name')
			.then((response) => response.json())
			.then((data) => {
				const resList = data?.Body?.SearchDirectoryResponse?.calresource;
				if (resList) {
					if (data?.Body?.SearchDirectoryResponse?.searchTotal) {
						setTotalAccount(data?.Body?.SearchDirectoryResponse?.searchTotal);
					}
					const rList: any[] = [];
					resList.forEach((item: any, index: number) => {
						rList.push({
							id: item?.id,
							columns: [
								<Text size="medium" weight="light" key={item?.id} color="gray0">
									{item?.a?.find((a: any) => a?.n === 'displayName')?._content}
								</Text>,
								<Text size="medium" weight="light" key={item?.id} color="gray0">
									{item?.name}
								</Text>,
								<Text size="medium" weight="light" key={item?.id} color="gray0">
									{item?.a?.find((a: any) => a?.n === 'zimbraAccountStatus')?._content}
								</Text>,
								<Text size="medium" weight="light" key={item?.id} color="gray0">
									{item?.a?.find((a: any) => a?.n === 'zimbraLastLogonTimestamp')?._content
										? moment(
												item?.a?.find((a: any) => a?.n === 'zimbraLastLogonTimestamp')?._content,
												'YYYYMMDDHHmmss.Z'
										  ).format('YY/MM/DD | hh:MM')
										: t('label.never_logged_in', 'Never logged In')}
								</Text>,
								<Text size="medium" weight="light" key={item?.id} color="gray0">
									{item?.a?.find((a: any) => a?.n === 'description')?._content}
								</Text>
							]
						});
					});
					setResourceList(rList);
				}
			});
	}, [t, offset, limit]);

	useEffect(() => {
		getResourceList();
	}, [offset, getResourceList]);

	return (
		<Container padding={{ all: 'large' }} mainAlignment="flex-start" background="gray6">
			<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
				<Container
					orientation="vertical"
					mainAlignment="space-around"
					background="gray6"
					height="58px"
				>
					<Row orientation="horizontal" width="100%" padding={{ all: 'large' }}>
						<Row mainAlignment="flex-start" width="30%" crossAlignment="flex-start">
							<Text size="medium" weight="bold" color="gray0">
								{t('label.resources', 'Resources')}
							</Text>
						</Row>
						<Row width="70%" mainAlignment="flex-end" crossAlignment="flex-end">
							<Padding right="medium">
								<IconButton
									iconColor="gray6"
									backgroundColor="primary"
									icon="Plus"
									height={36}
									width={36}
								/>
							</Padding>
							<Padding right="medium">
								<Button
									label={t('label.details', 'Details')}
									color="primary"
									type="outlined"
									disabled
								/>
							</Padding>
							<Button
								type="outlined"
								label={t('label.bulk_actions', 'Bulk Actions')}
								icon="ArrowIosDownward"
								iconPlacement="right"
								color="primary"
								disabled
							/>
						</Row>
					</Row>
				</Container>
			</Row>
			<Row orientation="horizontal" width="100%" background="gray6">
				<Divider />
			</Row>
			<Container
				orientation="column"
				crossAlignment="flex-start"
				mainAlignment="flex-start"
				style={{ overflow: 'auto' }}
				width="100%"
				height="calc(100vh - 150px)"
				padding={{ top: 'large' }}
			>
				<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
					<Container height="fit" crossAlignment="flex-start" background="gray6">
						<Row
							orientation="horizontal"
							mainAlignment="space-between"
							crossAlignment="flex-start"
							width="fill"
							padding={{ all: 'large' }}
						>
							<Container>
								<Input
									backgroundColor="gray5"
									label={t('label.search_dot', 'Search ...')}
									CustomIcon={(): any => <Icon icon="FunnelOutline" size="large" color="primary" />}
								/>
							</Container>
						</Row>
						<Row
							orientation="horizontal"
							mainAlignment="space-between"
							crossAlignment="flex-start"
							width="fill"
							padding={{ all: 'large' }}
						>
							{resourceList && resourceList.length > 0 && (
								<Table rows={resourceList} headers={headers} showCheckbox={false} />
							)}
							{resourceList.length === 0 && (
								<Container orientation="column" crossAlignment="center" mainAlignment="flex-start">
									<Row>
										<img src={logo} alt="logo" />
									</Row>
									<Row
										padding={{ top: 'extralarge' }}
										orientation="vertical"
										crossAlignment="center"
										style={{ 'text-align': 'center' }}
									>
										<Text weight="light" color="#828282" size="large" overflow="break-word">
											{t('label.this_list_is_empty', 'This list is empty.')}
										</Text>
									</Row>
									<Row
										orientation="vertical"
										crossAlignment="center"
										style={{ 'text-align': 'center' }}
										padding={{ top: 'small' }}
										width="53%"
									>
										<Text weight="light" color="#828282" size="large" overflow="break-word">
											<Trans
												i18nKey="label.create_resource_msg"
												defaults="You can create a new resource by clicking on <bold>Create</bold> button (upper left corner) or on the Add (<bold>+</bold>) button up here"
												components={{ bold: <strong /> }}
											/>
										</Text>
									</Row>
								</Container>
							)}
						</Row>
						<Row
							orientation="horizontal"
							mainAlignment="space-between"
							crossAlignment="flex-start"
							width="fill"
							padding={{ all: 'large' }}
						>
							{resourceList && resourceList.length > 0 && (
								<Paginig totalItem={totalAccount} setOffset={setOffset} pageSize={limit} />
							)}
						</Row>
					</Container>
				</Row>
			</Container>
		</Container>
	);
};

export default DomainResources;
