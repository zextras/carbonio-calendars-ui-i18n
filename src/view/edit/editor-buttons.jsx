import React from 'react';
import { Row, Button, Padding } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';

export default function ({ onSave, onSend }) {
	const { t } = useTranslation();
	return (
		<Row padding={{ all: 'medium' }} height="fit" width="fill" mainAlignment="flex-end">
			<Button type="outlined" label={t('Send')} icon="PaperPlane" disabled onClick={onSend} />
			<Padding left="medium">
				<Button label={t('Save')} icon="SaveOutline" onClick={onSave} />
			</Padding>
		</Row>
	);
}
