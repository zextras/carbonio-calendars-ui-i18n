/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useContext } from 'react';
import { Container, Row, Input, Select, Switch, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { AdvancedVolumeContext } from './create-advanced-volume-context';
import { volumeAllocationList } from '../../../../../utility/utils';

const AdvancedMailstoresDefinition: FC = () => {
	const context = useContext(AdvancedVolumeContext);
	const { t } = useTranslation();
	const { advancedVolumeDetail, setAdvancedVolumeDetail } = context;

	// const changeVolDetail = useCallback(
	// 	(e) => {
	// 		setVolumeDetail((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
	// 	},
	// 	[setVolumeDetail]
	// );

	// const onVolAllocationChange = (v: any): any => {
	// 	setAdvancedVolumeDetail((prev: any) => ({ ...prev, volumeMain: v }));
	// };

	// const changeSwitchOption = useCallback(
	// 	(key: string): void => {
	// 		setVolumeDetail((prev: any) => ({ ...prev, [key]: !volumeDetail[key] }));
	// 	},
	// 	[volumeDetail, setVolumeDetail]
	// );

	return (
		<>
			<Container mainAlignment="flex-start" padding={{ horizontal: 'large' }}>
				<Row padding={{ top: 'large' }} width="100%">
					<Input
						inputName="server"
						label={t('label.volume_server_name', 'Server')}
						backgroundColor="gray6"
						value="ServerName#1"
						// onChange={changeVolDetail}
					/>
				</Row>
				{/* <Row padding={{ top: 'large' }} width="100%">
					<Select
						items={volumeAllocationList}
						background="gray5"
						label={t('label.volume_allocation', 'Allocation')}
						defaultSelection={
              label: 'Local',
              value: 1
            }
						showCheckbox={false}
						onChange={onVolAllocationChange}
					/>
				</Row> */}
				<Row padding={{ top: 'large' }} width="100%">
					<Input
						inputName="volumeName"
						label={t('label.volume_name', 'Volume Name')}
						backgroundColor="gray5"
						value="NewVolume#17"
					/>
				</Row>
			</Container>
		</>
	);
};

export default AdvancedMailstoresDefinition;
