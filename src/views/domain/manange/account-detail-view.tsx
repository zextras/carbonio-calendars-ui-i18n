/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import moment from 'moment';
import {
	Container,
	Input,
	Row,
	Text,
	IconButton,
	Padding,
	Icon,
	Quota
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AccountDetailContainer = styled(Container)`
	z-index: 10;
	position: absolute;
	top: 62px;
	right: 12px;
	bottom: 0px;
	left: ${'max(calc(100% - 680px), 12px)'};
	transition: left 0.2s ease-in-out;
	height: auto;
	width: auto;
	max-height: 100%;
	overflow: hidden;
	box-shadow: -6px 4px 5px 0px rgba(0, 0, 0, 0.4);
`;

const AccountDetailView: FC<any> = ({
	selectedAccount,
	setShowAccountDetailView,
	STATUS_COLOR
}) => {
	const [t] = useTranslation();
	console.log('_selectedAccount', selectedAccount);

	return (
		<AccountDetailContainer background="gray5" mainAlignment="flex-start">
			<Row
				mainAlignment="flex-start"
				crossAlignment="center"
				orientation="horizontal"
				background="white"
				width="fill"
				height="48px"
				padding={{ vertical: 'small' }}
				style={{ borderBottom: '1px solid #E6E9ED' }}
			>
				<Row padding={{ horizontal: 'large' }}></Row>
				<Row takeAvailableSpace mainAlignment="flex-start">
					<Text size="medium" overflow="ellipsis" weight="bold">
						{`${selectedAccount?.name} ${t('label.details', 'Details')}`}
					</Text>
				</Row>
				<Row padding={{ right: 'extrasmall' }}>
					<IconButton
						size="medium"
						icon="CloseOutline"
						onClick={(): void => setShowAccountDetailView(false)}
					/>
				</Row>
			</Row>
			<Container
				padding={{ left: 'large' }}
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				height="calc(100% - 64px)"
				background="white"
			>
				<Row padding={{ top: 'extralarge' }}>
					<Text
						size="small"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
						weight="bold"
					>
						{t('label.account', 'Account')}
					</Text>
				</Row>
				<Row width="100%" padding={{ top: 'large' }}>
					<Padding left="medium" />
					<Row
						width="48%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="PersonOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input label="Name" backgroundColor="gray6" value={selectedAccount?.displayName} />
						</Row>
					</Row>
					<Row
						width="50%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="EmailOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input label="E-mail" backgroundColor="gray6" value={selectedAccount?.name} />
						</Row>
					</Row>
				</Row>
				<Row width="100%" padding={{ top: 'large' }}>
					<Padding left="medium" />
					<Row
						width="48%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="HardDriveOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input
								label="Server"
								backgroundColor="gray6"
								value={selectedAccount?.zimbraMailHost}
							/>
						</Row>
					</Row>
					<Row
						width="50%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="CubeOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input label="Space" backgroundColor="gray6" value="25,4 MB of 512 MB" />
							<Quota fill={10} background="gray5" />
						</Row>
					</Row>
				</Row>
				<Row width="100%" padding={{ top: 'large' }}>
					<Padding left="medium" />
					<Row
						width="48%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="FingerPrintOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input label="ID" backgroundColor="gray6" value={selectedAccount?.id} />
						</Row>
					</Row>
					<Row
						width="50%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon
								icon="DashboardOutline"
								size="large"
								color={STATUS_COLOR[selectedAccount?.zimbraAccountStatus]?.color}
							/>
						</Row>
						<Row width="80%">
							<Input
								label="Status"
								backgroundColor="gray6"
								value={STATUS_COLOR[selectedAccount?.zimbraAccountStatus]?.label}
							/>
						</Row>
					</Row>
				</Row>
				<Row width="100%" padding={{ top: 'large' }}>
					<Padding left="medium" />
					<Row
						width="48%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="CalendarOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input
								label="Creation Date"
								backgroundColor="gray6"
								value={moment(selectedAccount?.zimbraCreateTimestamp, 'YYYYMMDDHHmmss.Z').format(
									'DD MMM YYYY | hh:MM:SS A'
								)}
							/>
						</Row>
					</Row>
					<Row
						width="50%"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
					>
						<Row padding={{ top: 'large', right: 'small' }}>
							<Icon icon="ClockOutline" size="large" color="gray0" />
						</Row>
						<Row width="80%">
							<Input
								label="Last Access"
								backgroundColor="gray6"
								value={
									selectedAccount?.zimbraLastLogonTimestamp
										? moment(selectedAccount?.zimbraLastLogonTimestamp, 'YYYYMMDDHHmmss.Z').format(
												'DD MMM YYYY | hh:MM:SS A'
										  )
										: t('label.never_logged_in', 'Never logged in')
								}
							/>
						</Row>
					</Row>
				</Row>
				<Row padding={{ top: 'extralarge' }}>
					<Text
						size="small"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
						weight="bold"
					>
						{t('label.description', 'Description')}
					</Text>
				</Row>
				<Row width="100%" mainAlignment="flex-start" crossAlignment="flex-start">
					<Padding top="small" right="extralarge" bottom="small" left="large">
						<Text size="small" overflow="break-word">
							{selectedAccount?.description}
						</Text>
					</Padding>
				</Row>
				<Row padding={{ top: 'extralarge' }}>
					<Text
						size="small"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
						weight="bold"
					>
						{t('label.notes', 'Notes')}
					</Text>
				</Row>
				<Row width="100%" mainAlignment="flex-start" crossAlignment="flex-start">
					<Padding top="small" right="extralarge" bottom="small" left="large">
						<Text size="small" overflow="break-word">
							{selectedAccount?.zimbraNotes}
						</Text>
					</Padding>
				</Row>
			</Container>
		</AccountDetailContainer>
	);
};
export default AccountDetailView;
