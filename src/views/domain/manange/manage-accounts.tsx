/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { filter } from 'lodash';
import { Container, Input, Row, Text, Table, Divider } from '@zextras/carbonio-design-system';
import { useDomainStore } from '../../../store/domain/store';

import Paginig from '../../components/paging';
import { accountListDirectory } from '../../../services/account-list-directory-service';
import AccountDetailView from './account-detail-view';

// {"account":[{"name":"dfrison@demo.zextras.io","id":"1b4731f2-ab69-4636-b394-7d98422d9719","isExternal":false,"a":[{"n":"uid","_content":"dfrison"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"1b4731f2-ab69-4636-b394-7d98422d9719"},{"n":"zimbraMailHost","_content":"gk-m01a.demo.zextras.io"},{"n":"cn","_content":"dfrison"},{"n":"sn","_content":"dfrison"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"dfrison@test1.dom","id":"603dca62-757f-43f5-9f24-2bcb610ad28c","isExternal":false,"a":[{"n":"uid","_content":"dfrison"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"603dca62-757f-43f5-9f24-2bcb610ad28c"},{"n":"zimbraMailHost","_content":"gk-m01a.demo.zextras.io"},{"n":"cn","_content":"dfrison"},{"n":"sn","_content":"dfrison"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"u1@demo.zextras.io","id":"30951fe7-2fa4-4e46-9b25-4f658e28f8d5","isExternal":false,"a":[{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"u1"},{"n":"zimbraMailStatus","_content":"enabled"},{"n":"zimbraIsDelegatedAdminAccount","_content":"TRUE"},{"n":"uid","_content":"u1"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraLastLogonTimestamp","_content":"20220428144402.043Z"},{"n":"zimbraId","_content":"30951fe7-2fa4-4e46-9b25-4f658e28f8d5"},{"n":"sn","_content":"u1"}]},{"name":"u1@luca.demo","id":"7333cef7-0813-428e-b6ee-ee6c66f6f63d","isExternal":false,"a":[{"n":"uid","_content":"u1"},{"n":"zimbraAuthTokenValidityValue","_content":"1"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"7333cef7-0813-428e-b6ee-ee6c66f6f63d"},{"n":"zimbraMailHost","_content":"gk-m01a.demo.zextras.io"},{"n":"cn","_content":"u1"},{"n":"sn","_content":"u1"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"u2@demo.zextras.io","id":"1ec75073-aa4c-42a8-859c-13b133cab6cd","isExternal":false,"a":[{"n":"uid","_content":"u2"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"1ec75073-aa4c-42a8-859c-13b133cab6cd"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"u2"},{"n":"sn","_content":"u2"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"u2@luca.demo","id":"44b34ba9-4688-4258-b11b-1bc51a65ee67","isExternal":false,"a":[{"n":"uid","_content":"u2"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"44b34ba9-4688-4258-b11b-1bc51a65ee67"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"u2"},{"n":"sn","_content":"u2"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"unew@demo.zextras.io","id":"03aa16cd-a811-4074-ab8e-9c03d58b8cbb","isExternal":false,"a":[{"n":"uid","_content":"unew"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraLastLogonTimestamp","_content":"20220603055153.334Z"},{"n":"zimbraIsAdminAccount","_content":"TRUE"},{"n":"zimbraId","_content":"03aa16cd-a811-4074-ab8e-9c03d58b8cbb"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"unew"},{"n":"sn","_content":"unew"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"user@test1.dom","id":"b16d1bec-8ad9-41d5-9764-af6a3e22b5d9","isExternal":false,"a":[{"n":"uid","_content":"user"},{"n":"zimbraAuthTokenValidityValue","_content":"5"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraLastLogonTimestamp","_content":"20220523151719.390Z"},{"n":"zimbraId","_content":"b16d1bec-8ad9-41d5-9764-af6a3e22b5d9"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"user"},{"n":"sn","_content":"user"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"uu2@example.com","id":"d83ef7e1-9527-4d14-8aa8-826c15c362bf","isExternal":false,"a":[{"n":"uid","_content":"uu2"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraLastLogonTimestamp","_content":"20220517143449.689Z"},{"n":"zimbraId","_content":"d83ef7e1-9527-4d14-8aa8-826c15c362bf"},{"n":"zimbraIsAdminAccount","_content":"TRUE"},{"n":"zimbraMailHost","_content":"gk-m01a.demo.zextras.io"},{"n":"cn","_content":"uu2"},{"n":"sn","_content":"uu2"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"uu@example.com","id":"82164b6e-d2d9-4c12-bfe1-9901b64ecdb9","isExternal":false,"a":[{"n":"uid","_content":"uu"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"82164b6e-d2d9-4c12-bfe1-9901b64ecdb9"},{"n":"zimbraMailHost","_content":"gk-m01a.demo.zextras.io"},{"n":"cn","_content":"uu"},{"n":"sn","_content":"uu"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"uz0@demo.zextras.io","id":"aa48d811-29d0-4354-91cf-3e30439f5430","isExternal":false,"a":[{"n":"uid","_content":"uz0"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraId","_content":"aa48d811-29d0-4354-91cf-3e30439f5430"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"uz0"},{"n":"sn","_content":"uz0"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"uz@demo.zextras.io","id":"d4a8388a-0970-4d08-84eb-765f98d84d4f","isExternal":false,"a":[{"n":"uid","_content":"uz"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraLastLogonTimestamp","_content":"20220517135407.537Z"},{"n":"zimbraId","_content":"d4a8388a-0970-4d08-84eb-765f98d84d4f"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"cn","_content":"uz"},{"n":"sn","_content":"uz"},{"n":"zimbraMailStatus","_content":"enabled"}]},{"name":"zextras@demo.zextras.io","id":"71e9150f-c52c-4272-ad18-e35f620f2402","isExternal":false,"a":[{"n":"zimbraAuthTokenValidityValue","_content":"0"},{"n":"zimbraMailHost","_content":"gk-m01.demo.zextras.io"},{"n":"description","_content":"Administrative Account"},{"n":"cn","_content":"zextras"},{"n":"zimbraMailStatus","_content":"enabled"},{"n":"uid","_content":"zextras"},{"n":"zimbraAccountStatus","_content":"active"},{"n":"zimbraLastLogonTimestamp","_content":"20220519063754.356Z"},{"n":"zimbraIsAdminAccount","_content":"TRUE"},{"n":"zimbraId","_content":"71e9150f-c52c-4272-ad18-e35f620f2402"},{"n":"sn","_content":"zextras"}]}],"more":false,"searchTotal":13,"_jsns":"urn:zimbraAdmin"}
const SettingRow: FC<{ children?: any; wrap?: any }> = ({ children, wrap }) => (
	<Row
		orientation="horizontal"
		mainAlignment="space-between"
		crossAlignment="flex-start"
		width="fill"
		wrap={wrap || 'nowrap'}
	>
		{children}
	</Row>
);
const ManageAccounts: FC = () => {
	const [t] = useTranslation();
	const domainInformation = useDomainStore((state) => state.domain?.a);

	const headers: any = useMemo(
		() => [
			{
				id: 'name',
				label: t('label.email', 'Name'),
				width: '15%',
				bold: true
			},
			{
				id: 'email',
				label: t('label.name', 'Email'),
				width: '15%',
				bold: true
			},
			{
				id: 'type',
				label: t('label.type', 'Type'),
				width: '10%',
				bold: true
			},
			{
				id: 'status',
				label: t('label.status', 'Status'),
				width: '10%',
				bold: true
			},
			{
				id: 'description',
				label: t('label.description', 'Description'),
				width: '50%',
				bold: true
			}
		],
		[t]
	);

	const [accountList, setAccountList] = useState<any[]>([]);
	const [accountListFilter, setAccountListFilter] = useState<any[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<any>({});
	const [offset, setOffset] = useState<number>(0);
	const [limit, setLimit] = useState<number>(10);
	const [searchString, setSearchString] = useState<string>('');
	const [totalAccount, setTotalAccount] = useState<number>(0);
	const [showAccountDetailView, setShowAccountDetailView] = useState<boolean>(false);

	const [domainData, setDomainData]: any = useState({});

	const STATUS_COLOR: any = useMemo(
		() => ({
			active: {
				color: '#8BC34A',
				label: 'Active'
			},
			maintenance: {
				color: '#2196D3',
				label: 'Maintenance'
			},
			locked: {
				color: '#D74942',
				label: 'Locked'
			},
			closed: {
				color: '#828282',
				label: 'Closed'
			},
			pending: {
				color: '#828282',
				label: 'Pending'
			}
		}),
		[]
	);
	const getAccountList = useCallback(
		(domainName: string): void => {
			const type = 'accounts';
			const attrs =
				'displayName,zimbraId,zimbraAliasTargetId,cn,sn,zimbraMailHost,uid,zimbraCOSId,zimbraAccountStatus,zimbraLastLogonTimestamp,description,zimbraIsSystemAccount,zimbraIsDelegatedAdminAccount,zimbraIsAdminAccount,zimbraIsSystemResource,zimbraAuthTokenValidityValue,zimbraIsExternalVirtualAccount,zimbraMailStatus,zimbraIsAdminGroup,zimbraCalResType,zimbraDomainType,zimbraDomainName,zimbraDomainStatus,zimbraIsDelegatedAdminAccount,zimbraIsAdminAccount,zimbraIsSystemResource,zimbraIsSystemAccount,zimbraIsExternalVirtualAccount,zimbraCreateTimestamp,zimbraLastLogonTimestamp,zimbraQuotaUsage,zimbraNotes';
			console.log('domainName', domainName);
			accountListDirectory(attrs, type, domainName, '')
				.then((response) => response.json())
				.then((data) => {
					console.log('data=>', data?.Body?.SearchDirectoryResponse?.account);
					const accountListResponse: any = data?.Body?.SearchDirectoryResponse?.account;
					if (accountListResponse && Array.isArray(accountListResponse)) {
						const accountListArr: any = [];
						if (data?.Body?.SearchDirectoryResponse?.searchTotal) {
							setTotalAccount(data?.Body?.SearchDirectoryResponse?.searchTotal);
						}
						accountListResponse.map((item: any): any => {
							// const obj: any = {};
							item?.a?.map((ele: any) => {
								// eslint-disable-next-line no-param-reassign
								item[ele?.n] = ele._content;
								return '';
							});
							// console.log('obj', obj);
							accountListArr.push({
								id: item?.id,
								columns: [
									<Text
										size="medium"
										key={item?.id}
										color="#414141"
										onClick={(): void => {
											setSelectedAccount(item);
											setShowAccountDetailView(true);
										}}
									>
										{item?.name}
									</Text>,
									<Text
										size="medium"
										key={item?.id}
										color="#414141"
										onClick={(): void => console.log('Row clicked', item)}
									>
										{item?.displayName}
									</Text>,
									<Text
										size="medium"
										key={item?.id}
										color="#828282"
										onClick={(): void => console.log('Row clicked', item)}
									>
										{item?.uid}
									</Text>,
									<Text
										size="medium"
										key={item?.id}
										color={STATUS_COLOR[item?.zimbraAccountStatus]?.color}
										onClick={(): void => console.log('Row clicked', item)}
									>
										{STATUS_COLOR[item?.zimbraAccountStatus]?.label}
									</Text>,
									<Text
										size="medium"
										key={item?.id}
										color="#414141"
										onClick={(): void => console.log('Row clicked', item)}
									>
										{item?.description}
									</Text>
								],
								item,
								clickable: true
							});
							return '';
						});
						setAccountList([]);
						setAccountList(accountListArr);
					}
				});
		},
		[STATUS_COLOR]
	);
	useEffect(() => {
		const searchFilterArr = filter(accountList, (o) =>
			o?.item?.name?.toLowerCase()?.includes(searchString)
		);
		const filterList: any = searchFilterArr.slice(offset, offset + limit);
		setTotalAccount(searchFilterArr.length);
		setAccountListFilter(filterList);
	}, [accountList, limit, offset, searchString]);
	useEffect(() => {
		console.log('domainInformation=>', domainInformation);
		if (!!domainInformation && domainInformation.length > 0) {
			const obj: any = {};
			setOffset(0);
			setTotalAccount(0);
			domainInformation.map((item: any) => {
				obj[item?.n] = item._content;
				return '';
			});
			setDomainData(obj);
		}
	}, [domainInformation]);
	useEffect(() => {
		if (domainData.zimbraDomainName) {
			getAccountList(domainData.zimbraDomainName);
		}
	}, [domainData, getAccountList]);
	return (
		<Container padding={{ all: 'large' }} background="gray5">
			<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
				<Container
					orientation="vertical"
					mainAlignment="space-around"
					background="gray6"
					height="58px"
				>
					<Row orientation="horizontal" width="100%">
						<Row
							padding={{ all: 'large' }}
							mainAlignment="flex-start"
							width="100%"
							crossAlignment="flex-start"
						>
							<Text size="medium" weight="bold" color="gray0">
								{t('domain.account_list', 'Account List')}
							</Text>
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
				height="calc(100vh - 200px)"
			>
				<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
					<Container height="fit" crossAlignment="flex-start" background="gray6">
						<Container padding={{ all: 'small' }}>
							<SettingRow>
								<Container padding={{ all: 'small' }}>
									<Input
										label={t('label.search', 'Search')}
										value={searchString}
										background="gray5"
										onChange={(e: any): any => {
											setSearchString(e.target.value);
										}}
									/>
								</Container>
							</SettingRow>
						</Container>

						<Container padding={{ all: 'large' }}>
							<SettingRow>
								<Table
									rows={accountListFilter}
									headers={headers}
									showCheckbox={false}
									multiSelect={false}
								/>
							</SettingRow>
							<Row
								orientation="horizontal"
								mainAlignment="space-between"
								crossAlignment="flex-start"
								width="fill"
								padding={{ top: 'medium' }}
							>
								<Divider />
							</Row>
							<Row orientation="horizontal" mainAlignment="flex-start" width="100%">
								<Paginig totalItem={totalAccount} setOffset={setOffset} pageSize={limit} />
							</Row>
						</Container>
					</Container>
				</Row>
			</Container>
			{showAccountDetailView && (
				<AccountDetailView
					selectedAccount={selectedAccount}
					setShowAccountDetailView={setShowAccountDetailView}
					STATUS_COLOR={STATUS_COLOR}
				/>
			)}
		</Container>
	);
};

export default ManageAccounts;
