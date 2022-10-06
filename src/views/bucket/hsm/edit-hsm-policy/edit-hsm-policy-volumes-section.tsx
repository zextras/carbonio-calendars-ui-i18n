/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Container, Text, Padding, Switch, Table } from '@zextras/carbonio-design-system';
import React, { FC, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ListRow from '../../../list/list-row';

const EditHsmPolicyVolumesSection: FC<any> = () => {
	const [t] = useTranslation();
	const [showSourceVolume, setShowSourceVolume] = useState<boolean>(false);
	const [showDestinationVolume, setShowDestinationVolume] = useState<boolean>(false);
	const headers = useMemo(
		() => [
			{
				id: 'name',
				label: t('hsm.name', 'Name'),
				width: '25%',
				bold: true
			},
			{
				id: 'name',
				label: t('hsm.allocation', 'Allocation'),
				width: '25%',
				bold: true
			},
			{
				id: 'name',
				label: t('hsm.type', 'Type'),
				width: '25%',
				bold: true
			},
			{
				id: 'name',
				label: t('hsm.current', 'Current'),
				width: '25%',
				bold: true
			}
		],
		[t]
	);
	return (
		<Container
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			height="calc(100vh - 300px)"
			background="white"
			style={{ overflow: 'auto', padding: '16px' }}
		>
			<ListRow>
				<Padding bottom="large">
					<Text size="medium" weight="bold" color="gray0">
						{<Trans i18nKey="hsm.source_volume" defaults="Source Volume" />}
					</Text>
				</Padding>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					<Text
						size="medium"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
						color="secondary"
						style={{ 'white-space': 'normal' }}
					>
						{t(
							'hsm.all_primary_volume_used_source_msg',
							'All primary volumes will be used as source by default. Or select manually other volumes.'
						)}
					</Text>
				</Padding>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					<Switch
						label={t('hsm.select_manually_source_volumes', 'Select manually source volumes')}
						value={showSourceVolume}
						onClick={(): void => {
							setShowSourceVolume(!showSourceVolume);
						}}
					/>
				</Padding>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					{showSourceVolume && <Table rows={[]} headers={headers} />}
				</Padding>
			</ListRow>

			<ListRow>
				<Padding bottom="large">
					<Text size="medium" weight="bold" color="gray0">
						{<Trans i18nKey="hsm.destination_volume" defaults="Destination Volume" />}
					</Text>
				</Padding>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					<Text
						size="medium"
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						orientation="horizontal"
						color="secondary"
						style={{ 'white-space': 'normal' }}
					>
						{t(
							'hsm.all_secondary_volume_used_source_msg',
							'The current secondary volume will be used as a destination. Or select manually other volumes.'
						)}
					</Text>
				</Padding>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					<Switch
						label={t(
							'hsm.select_manually_destination_volumes',
							'Select manually destination volumes'
						)}
						value={showDestinationVolume}
						onClick={(): void => {
							setShowDestinationVolume(!showDestinationVolume);
						}}
					/>
				</Padding>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					{showDestinationVolume && <Table rows={[]} headers={headers} />}
				</Padding>
			</ListRow>
		</Container>
	);
};

export default EditHsmPolicyVolumesSection;
