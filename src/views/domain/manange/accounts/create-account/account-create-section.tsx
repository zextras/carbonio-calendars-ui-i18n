/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import {
	Container,
	Input,
	Row,
	Select,
	Padding,
	Text,
	Icon
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

const AccountCreateSection: FC<{
	domainName: string | undefined;
	createAccountReq: any;
}> = ({ domainName, createAccountReq }) => {
	const [t] = useTranslation();

	return (
		<Container
			mainAlignment="flex-start"
			padding={{ left: 'large', right: 'extralarge', bottom: 'large' }}
		>
			<Row mainAlignment="flex-start" padding={{ left: 'small' }} width="100%">
				<Text size="small" color="Gray0" weight="bold">
					Account
				</Text>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Row width="48%" mainAlignment="flex-start">
						<Input
							label={t('label.user', 'User')}
							backgroundColor="gray5"
							value="Pio Venacifra"
							readOnly
						/>
					</Row>
					<Padding width="4%" />
					<Row width="48%" mainAlignment="flex-start">
						<Input
							label={t('label.mail', 'Mail')}
							backgroundColor="gray5"
							value="piovenacifra@carbonio.com"
							readOnly
						/>
					</Row>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Row width="48%" mainAlignment="flex-start">
						<Input
							label={t('label.password', 'Password')}
							backgroundColor="gray5"
							value="Mil0kun15"
							CustomIcon={(): any => <Icon icon="CopyOutline" size="large" color="Gray0" />}
						/>
					</Row>
					<Padding width="4%" />
					<Row width="48%" mainAlignment="flex-start">
						<Select
							background="gray6"
							label={t('label.must_change_passowrd', 'Must Change Passowrd?')}
							showCheckbox={false}
							padding={{ right: 'medium' }}
							defaultSelection={{ value: '4', label: 'Yes' }}
						/>
					</Row>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Input
						label={t(
							'label.first_2FA_access_token_link',
							'First 2FA Access Token Link (send this to the user)'
						)}
						backgroundColor="gray5"
						value="otpauth://totp/Example:oscardabano@company.dom..."
						CustomIcon={(): any => <Icon icon="CopyOutline" size="large" color="Gray0" />}
					/>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Row width="32%" mainAlignment="flex-start">
						<Select
							background="gray5"
							label={t('label.status', 'Status')}
							showCheckbox={false}
							padding={{ right: 'medium' }}
							defaultSelection={{ value: '4', label: 'Active' }}
						/>
					</Row>
					<Padding width="2%" />
					<Row width="32%" mainAlignment="flex-start">
						<Select
							background="gray5"
							label={t('label.language', 'Language')}
							showCheckbox={false}
							padding={{ right: 'medium' }}
							defaultSelection={{ value: '4', label: 'English (Default)' }}
						/>
					</Row>
					<Padding width="2%" />
					<Row width="32%" mainAlignment="flex-start">
						<Select
							background="gray5"
							label={t('label.time_zone', 'Time Zone')}
							showCheckbox={false}
							padding={{ right: 'medium' }}
							defaultSelection={{ value: '4', label: 'Rome (Local)' }}
						/>
					</Row>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Select
						background="gray6"
						label={t('label.cos', 'COS')}
						showCheckbox={false}
						padding={{ right: 'medium' }}
						defaultSelection={{ value: '4', label: 'company.dom (Default)' }}
					/>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Input
						label={t('label.space', 'Space')}
						backgroundColor="gray6"
						value="512 MB (CoS Default)"
						readOnly
					/>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Input
						label={t('label.description', 'Description')}
						backgroundColor="gray5"
						value="This new guy is joining SmokingBagels team next monday"
						readOnly
					/>
				</Row>
			</Row>
		</Container>
	);
};

export default AccountCreateSection;
