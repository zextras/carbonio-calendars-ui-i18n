import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Container, Button, IconButton } from '@zextras/zapp-ui';

const MultiButton = styled(Button)`
	border-radius: ${({ position }) => {
		switch (position) {
			case 'first': return '2px 0 0 2px';
			case 'last': return '0 2px 2px 0';
			case 'mid':
			default: return '0';
		}
	}};
	${({ position }) => (position === 'mid') && css`
		border-left: none;
		border-right: none;
	`};
`;

export default function CustomToolbar({
	label, onView, onNavigate, view
}) {
	const today = useCallback(() => onNavigate('TODAY'), [onNavigate]);
	const next = useCallback(() => onNavigate('NEXT'), [onNavigate]);
	const prev = useCallback(() => onNavigate('PREV'), [onNavigate]);
	const week = useCallback(() => onView('week'), [onView]);
	const day = useCallback(() => onView('day'), [onView]);
	const month = useCallback(() => onView('month'), [onView]);

	return (
		<Container width="fill" height="fit" padding={{ bottom: 'small' }}>
			<Container
				orientation="horizontal"
				width="fill"
				height={48}
				mainAlignment="space-between"
				background="gray5"
				padding={{ horizontal: 'small' }}
			>
				<Container width="fit" orientation="horizontal" mainAlignment="flex-start">
					<Button label="Today" type="outlined" onClick={today} />
				</Container>
				<Container orientation="horizontal">
					<IconButton iconColor="primary" icon="ChevronLeft" onClick={prev} />
					<Button type="ghost" label={label} onClick={() => console.warn('this feature is not implemented yet')} />
					<IconButton iconColor="primary" icon="ChevronRight" onClick={next} />
				</Container>
				<Container width="fit" orientation="horizontal" mainAlignment="flex-end">
					<MultiButton
						backgroundColor={view === 'month' ? 'highlight' : null}
						position="first"
						label="Month"
						type="outlined"
						onClick={month}
					/>
					<MultiButton
						backgroundColor={view === 'week' ? 'highlight' : null}
						position="mid"
						label="Week"
						type="outlined"
						onClick={week}
					/>
					<MultiButton
						backgroundColor={view === 'day' ? 'highlight' : null}
						position="last"
						label="Day"
						type="outlined"
						onClick={day}
					/>
				</Container>
			</Container>
		</Container>
	);
}
