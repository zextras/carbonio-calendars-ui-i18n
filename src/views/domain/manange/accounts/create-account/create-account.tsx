/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Button } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import { HorizontalWizard } from '../../../../app/component/hwizard';
import CreateAccountDetailSection from './create-account-detail-section';
import { Section } from '../../../../app/component/section';
import CreateAccountSectionView from './account-create-section';

const AccountDetailContainer = styled(Container)`
	z-index: 10;
	position: absolute;
	top: 43px;
	right: 12px;
	bottom: 0px;
	left: ${'max(calc(100% - 680px), 12px)'};
	transition: left 0.2s ease-in-out;
	height: auto;
	width: auto;
	max-height: 100%;
	overflow: hidden;
	box-shadow: -6px 4px 5px 0px rgba(0, 0, 0, 0.1);
	opacity: '10%;
`;

const WizardInSection: FC<any> = ({ wizard, wizardFooter, setToggleWizardSection }) => {
	const { t } = useTranslation();
	return (
		<Section
			title={t('account.new.create_account_wizard', 'Create Account Wizard')}
			padding={{ all: '0' }}
			footer={wizardFooter}
			divider
			showClose
			onClose={(): void => {
				setToggleWizardSection(false);
			}}
		>
			{wizard}
		</Section>
	);
};

// eslint-disable-next-line no-empty-pattern
const CreateAccount: FC<{
	setShowCreateAccountView: any;
	setSnackBarData: any;
	domainName: any;
}> = ({ setShowCreateAccountView, setSnackBarData, domainName }) => {
	const { t } = useTranslation();
	const [wizardData, setWizardData] = useState();

	const CreateAccountDetailSectionCB = useCallback(
		() => <CreateAccountDetailSection domainName={domainName} />,
		[domainName]
	);
	const CreateAccountSectionCB = useCallback(
		() => <CreateAccountSectionView domainName={domainName} />,
		[domainName]
	);
	const wizardSteps = [
		{
			name: 'details',
			label: t('label.details', 'DETAILS'),
			icon: 'Edit2Outline',
			view: CreateAccountDetailSectionCB,
			CancelButton: (props: any) => (
				<Button
					{...props}
					type="outlined"
					key="wizard-cancel"
					label={'CANCEL'}
					color="secondary"
					icon="CloseOutline"
					iconPlacement="right"
					onClick={(): void => setShowCreateAccountView(false)}
				/>
			),
			PrevButton: (props: any) => '',
			NextButton: (props: any) => (
				<Button
					{...props}
					label={'NEXT STEP'}
					style={{ marginRight: '33px' }}
					icon="ChevronRightOutline"
					iconPlacement="right"
				/>
			)
		},
		{
			name: 'create',
			label: t('label.create', 'CREATE'),
			icon: 'PersonOutline',
			view: CreateAccountSectionCB,
			CancelButton: (props: any) => (
				<Button
					{...props}
					type="outlined"
					key="wizard-cancel"
					label={'CANCEL'}
					color="secondary"
					icon="CloseOutline"
					iconPlacement="right"
					onClick={(): void => setShowCreateAccountView(false)}
				/>
			),
			PrevButton: (props: any) => '',
			NextButton: (props: any) => (
				<Button
					{...props}
					label={t('commons.create_with_there_data', 'CREATE WITH THESE DATA')}
					icon="PersonOutline"
					iconPlacement="right"
					style={{ marginRight: '100px' }}
					onClick={(): void => {
						setShowCreateAccountView(false);
						setSnackBarData(true);
					}}
				/>
			)
		}
	];

	const onComplete = useCallback(() => {
		setShowCreateAccountView(false);
	}, [setShowCreateAccountView]);

	return (
		<AccountDetailContainer background="gray5" mainAlignment="flex-start">
			<HorizontalWizard
				steps={wizardSteps}
				Wrapper={WizardInSection}
				onChange={setWizardData}
				onComplete={onComplete}
				setToggleWizardSection={setShowCreateAccountView}
			/>
		</AccountDetailContainer>
	);
};
export default CreateAccount;
