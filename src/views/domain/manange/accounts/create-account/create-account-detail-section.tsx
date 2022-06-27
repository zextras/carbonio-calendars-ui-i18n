/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useState } from 'react';
import {
	Container,
	Input,
	Row,
	Select,
	Padding,
	Text,
	Icon,
	Switch
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

const CreateAccountDetailSection: FC<{
	domainName: string | undefined;
	setUserName: any;
}> = ({ domainName, setUserName }) => {
	const [t] = useTranslation();
	const [isCheck, setIsCheck] = useState(true);
	return (
		<Container
			mainAlignment="flex-start"
			padding={{ left: 'large', right: 'extralarge', bottom: 'large' }}
		>
			<Row mainAlignment="flex-start" padding={{ left: 'small' }} width="100%">
				<Text size="small" color="Gray0" weight="bold">
					{t('label.account', 'Account')}
				</Text>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Row width="32%" mainAlignment="flex-start">
						<Input label={t('label.name', 'Name')} backgroundColor="gray5" readOnly />
					</Row>
					<Padding width="2%" />
					<Row width="32%" mainAlignment="flex-start">
						<Input
							label={t('label.second_name_initials', 'Second Name Initials')}
							backgroundColor="gray5"
							readOnly
						/>
					</Row>
					<Padding width="2%" />
					<Row width="32%" mainAlignment="flex-start">
						<Input label={t('label.surname', 'Surname')} backgroundColor="gray5" readOnly />
					</Row>
				</Row>
				<Row width="100%" padding={{ top: 'large', left: 'large' }}>
					<Row width="48%" mainAlignment="flex-start">
						<Input
							background="gray5"
							label={t('label.userName', 'username (Auto-fill)')}
							name="ArnName"
							onChange={(e: any): any => {
								setUserName(e.target.value);
							}}
						/>
					</Row>
					<Padding width="4%" />
					<Row width="48%" mainAlignment="flex-start">
						<Row
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							width="10%"
							padding={{ top: 'small' }}
						>
							<Icon icon="AtOutline" size="large" />
						</Row>
						<Row width="90%" mainAlignment="flex-start" crossAlignment="flex-start">
							<Input
								label={t('label.domain_name', 'Domain Name')}
								background="gray6"
								value={domainName}
								disabled
							/>
						</Row>
					</Row>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Input
						label={t('label.viewed_name', 'Viewed Name (Auto-fill)')}
						backgroundColor="gray5"
						name="descriptiveName"
					/>
				</Row>
				<Row width="100%" padding={{ top: 'large', left: 'large' }}>
					<Row width="48%" mainAlignment="flex-start">
						<Input background="gray5" label={t('label.password', 'Password')} name="ArnName" />
					</Row>
					<Padding width="4%" />
					<Row width="48%" mainAlignment="flex-start">
						<Input
							background="gray5"
							label={t('label.repeat_password', 'Repeat Password')}
							name="ArnName"
						/>
					</Row>
				</Row>
				<Row width="100%" padding={{ top: 'large', left: 'large' }}>
					<Row width="48%" mainAlignment="flex-start">
						<Switch
							value={isCheck}
							onClick={(): void => setIsCheck(!isCheck)}
							label={t(
								'accountDetails.change_password_for_next_login',
								'Must change password on the next login'
							)}
						/>
					</Row>
					<Padding width="4%" />
					<Row width="48%" mainAlignment="flex-start">
						<Switch
							value={isCheck}
							onClick={(): void => setIsCheck(!isCheck)}
							label={t('accountDetails.generate_first_2FA_token', 'Generate first 2FA token')}
						/>
					</Row>
				</Row>
				<Row width="100%" padding={{ top: 'large', left: 'large' }} mainAlignment="flex-start">
					<Row mainAlignment="flex-start">
						<Switch
							value={isCheck}
							onClick={(): void => setIsCheck(!isCheck)}
							label={t(
								'accountDetails.enable_activeSync_remote_access',
								'Enable ActiveSync remote access'
							)}
						/>
					</Row>
				</Row>
			</Row>
			<Row mainAlignment="flex-start" padding={{ top: 'large', left: 'small' }} width="100%">
				<Row padding={{ top: 'large' }}>
					<Text size="small" color="Gray0" weight="bold">
						Settings
					</Text>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Row width="32%" mainAlignment="flex-start">
						<Select
							background="gray5"
							label={t('label.account_status', 'Account Status')}
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
					<Row width="32%" mainAlignment="flex-start">
						<Switch
							value={isCheck}
							onClick={(): void => setIsCheck(!isCheck)}
							label={t('accountDetails.default_COS', 'Default COS')}
						/>
					</Row>
					<Padding width="4%" />
					<Row width="64%" mainAlignment="flex-start">
						<Select
							background="gray6"
							label={t('label.class_of_Service', 'Class of Service')}
							showCheckbox={false}
							padding={{ right: 'medium' }}
							defaultSelection={{ value: '4', label: 'company.dom' }}
						/>
					</Row>
				</Row>
			</Row>
			<Row mainAlignment="flex-start" padding={{ top: 'large', left: 'small' }} width="100%">
				<Row padding={{ top: 'large' }}>
					<Text size="small" color="Gray0" weight="bold">
						Notes
					</Text>
				</Row>
				<Row padding={{ top: 'large', left: 'large' }} width="100%">
					<Input
						background="gray5"
						height="85px"
						label={t('label.description', 'Description')}
						name="ArnName"
					/>
				</Row>
			</Row>
		</Container>
	);
};

export default CreateAccountDetailSection;
