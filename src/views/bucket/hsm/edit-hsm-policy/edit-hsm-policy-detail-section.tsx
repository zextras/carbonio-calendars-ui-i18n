/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
	Container,
	Input,
	Text,
	Select,
	IconButton,
	Padding,
	Checkbox,
	Table
} from '@zextras/carbonio-design-system';
import React, { FC, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import ListRow from '../../../list/list-row';

const EditHsmPolicyDetailSection: FC<any> = () => {
	const [t] = useTranslation();
	const options: any[] = useMemo(
		() => [
			{
				label: t('hsm.after_date', 'After (Date)'),
				value: 'after'
			},
			{
				label: t('hsm.before_date', 'Before (Date)'),
				value: 'before'
			},
			{
				label: t('hsm.larger_size', 'Larger (Size)'),
				value: 'larger'
			},
			{
				label: t('hsm.smaller_size', 'Smaller (Size)'),
				value: 'small'
			}
		],
		[t]
	);

	const dateScaleOption: any[] = useMemo(
		() => [
			{
				label: t('hsm.days', 'Days'),
				value: 'days'
			},
			{
				label: t('hsm.months', 'Months'),
				value: 'months'
			},
			{
				label: t('hsm.years', 'Years'),
				value: 'years'
			}
		],
		[t]
	);

	const scaleOptions: any[] = useMemo(
		() => [
			{
				label: t('hsm.bytes', 'Byte (B)'),
				value: 'byte'
			},
			{
				label: t('hsm.kb', 'KB'),
				value: 'kb'
			},
			{
				label: t('hsm.mb', 'MB'),
				value: 'mb'
			},
			{
				label: t('hsm.gb', 'GB'),
				value: 'gb'
			}
		],
		[t]
	);

	const headers = useMemo(
		() => [
			{
				id: 'name',
				label: t('hsm.policy_criteria', 'Policy Criteria'),
				width: '100%',
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
				<Container padding={{ bottom: 'large' }}>
					<Input label={t('hsm.server', 'Server')} background="gray6" />
				</Container>
			</ListRow>
			<ListRow>
				<Padding bottom="large">
					<Text size="medium" weight="bold" color="gray0">
						{<Trans i18nKey="hsm.items" defaults="Items" />}
					</Text>
				</Padding>
			</ListRow>
			<ListRow>
				<Container mainAlignment="flex-start" crossAlignment="flex-start">
					<Checkbox iconColor="primary" size="small" label={t('hsm.all', 'All')} />
				</Container>
				<Container mainAlignment="flex-start" crossAlignment="flex-start">
					<Checkbox iconColor="primary" size="small" label={t('hsm.message', 'Message')} />
				</Container>
				<Container mainAlignment="flex-start" crossAlignment="flex-start">
					<Checkbox iconColor="primary" size="small" label={t('hsm.document', 'Document')} />
				</Container>
				<Container mainAlignment="flex-start" crossAlignment="flex-start">
					<Checkbox iconColor="primary" size="small" label={t('hsm.event', 'Event')} />
				</Container>
				<Container mainAlignment="flex-start" crossAlignment="flex-start">
					<Checkbox iconColor="primary" size="small" label={t('hsm.contact', 'Contact')} />
				</Container>
			</ListRow>
			<ListRow>
				<Padding bottom="large" top="large">
					<Text size="medium" weight="bold" color="gray0">
						{<Trans i18nKey="hsm.criteria" defaults="Criteria" />}
					</Text>
				</Padding>
			</ListRow>
			<ListRow>
				<Container
					mainAlignment="flex-start"
					crossAlignment="flex-start"
					padding={{ right: 'large' }}
				>
					<Select
						items={options}
						background="gray5"
						label={t('hsm.option', 'Option')}
						showCheckbox={false}
					/>
				</Container>
				<Container
					mainAlignment="flex-start"
					crossAlignment="flex-start"
					padding={{ right: 'large' }}
				>
					<Select
						items={dateScaleOption}
						background="gray5"
						label={t('hsm.scale', 'Scale')}
						showCheckbox={false}
					/>
				</Container>
				<Container
					mainAlignment="flex-start"
					crossAlignment="flex-start"
					padding={{ right: 'large' }}
				>
					<Select
						items={scaleOptions}
						background="gray5"
						label={t('hsm.value', 'Value')}
						showCheckbox={false}
					/>
				</Container>
				<Container style={{ border: '1px solid #2b73d2' }} width="fit">
					<IconButton iconColor="primary" icon="Plus" height={44} width={44} />
				</Container>
			</ListRow>
			<ListRow>
				<Padding top="large">
					<Table rows={[]} headers={headers} />
				</Padding>
			</ListRow>
		</Container>
	);
};

export default EditHsmPolicyDetailSection;
