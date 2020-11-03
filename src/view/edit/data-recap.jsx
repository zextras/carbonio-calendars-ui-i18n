import React from 'react';
import {
	Row, Avatar, Text, Container
} from '@zextras/zapp-ui';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ZIMBRA_STANDARD_COLORS } from '../../zimbra-standard-colors';

export default function ({ data }) {
	const { t } = useTranslation();

	return (
		<Row padding={{ all: 'medium' }} height="fit" width="fill" mainAlignment="flex-start" wrap="nowrap">
			<Avatar size="large" icon="CalendarOutline" style={{ background: data.resource.calendarColor ? data.resource.calendarColor.color : ZIMBRA_STANDARD_COLORS[0].color }} label="" />
			<Container mainAlignment="flex-start" crossAlignment="flex-start" padding={{ vertical: 'small', horizontal: 'medium' }}>
				<Row padding={{ bottom: 'small' }}>
					<Text overflow="break-word" weight="bold">{data.title || t('You will see the subject of this appointment here')}</Text>
				</Row>
				<Row padding={{ bottom: 'small' }}>
					<Text overflow="break-word" color="secondary" weight="medium">{t('Attendees')}</Text>
				</Row>
				<Row>
					<Text overflow="break-word" color="secondary">{moment(data.start).format(`dddd, LL[, ${t('from')} ]LT[ ${'to'} ${moment(data.end).format('LT')}]`)}</Text>
				</Row>
			</Container>
		</Row>
	);
}
