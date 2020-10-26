/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, {
	useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import styled, { css } from 'styled-components';
import { forEach, map } from 'lodash';
import {
	Checkbox,
	Collapse,
	Container,
	Icon,
	IconButton,
	Padding,
	Responsive,
	Text,
	useScreenMode,
} from '@zextras/zapp-ui';

function getKeyboardPreset(type, callback, ref = undefined) {
	function handleArrowUp(e) {
		const focusedElement = ref.current.querySelector('[tabindex]:focus');
		if (focusedElement) {
			const prevEl = focusedElement.previousElementSibling;
			if (prevEl) {
				prevEl.focus();
			}
			else {
				ref.current.querySelector('[tabindex]:last-child').focus();
			}
		}
		else {
			ref.current.querySelector('[tabindex]:first-child').focus();
		}
	}

	function handleArrowDown(e) {
		const focusedElement = ref.current.querySelector('[tabindex]:focus');
		if (focusedElement) {
			const nextEl = focusedElement.nextElementSibling;
			if (nextEl) {
				nextEl.focus();
			}
			else {
				ref.current.querySelector('[tabindex]:first-child').focus();
			}
		}
		else {
			ref.current.querySelector('[tabindex]:first-child').focus();
		}
	}

	const eventsArray = [];
	switch (type) {
		case 'listItem': {
			eventsArray.push({ type: 'keypress', callback, keys: ['Enter', 'NumpadEnter'] });
			break;
		}
		case 'button': {
			eventsArray.push({ type: 'keyup', callback, keys: ['Space'] });
			eventsArray.push({ type: 'keypress', callback: (e) => e.preventDefault(), keys: ['Space'] });
			eventsArray.push({ type: 'keypress', callback, keys: ['Enter', 'NumpadEnter'] });
			break;
		}
		case 'list': {
			eventsArray.push({ type: 'keydown', callback: handleArrowUp, keys: ['ArrowUp'] });
			eventsArray.push({ type: 'keydown', callback: handleArrowDown, keys: ['ArrowDown'] });
			break;
		}
		default:
			break;
	}
	return eventsArray;
}

function useKeyboard(ref, events) {
	const keyEvents = useMemo(() =>
		map(events, ({ keys, callback, haveToPreventDefault = true }) => (e) => {
			if (!keys.length || keys.includes(e.key) || keys.includes(e.code)) {
				if (haveToPreventDefault) {
					e.preventDefault();
				}
				callback(e);
			}
		}), [events]);

	useEffect(() => {
		if (ref.current != null) {
			forEach(keyEvents, (keyEvent, index) => {
				ref.current.addEventListener(events[index].type, keyEvent);
			});
		}

		return () => {
			if (ref.current != null) {
				forEach(keyEvents, (keyEvent, index) => {
					ref.current.removeEventListener(events[index].type, keyEvent);
				});
			}
		};
	}, [ref, events, keyEvents]);
}

function pseudoClasses(theme, color) {
	return css`
		transition: background 0.2s ease-out;
		&:focus {
			outline: none;
			background: ${theme.palette[color].focus};
		}
		&:hover {
			outline: none;
			background: ${theme.palette[color].hover};
		}
		&:active {
			outline: none;
			background: ${theme.palette[color].active};
		}
	`;
}

function useCombinedRefs(...refs) {
	const targetRef = useRef();
	useEffect(() => {
		refs.forEach((ref) => {
			if (!ref) return;

			if (typeof ref === 'function') {
				ref(targetRef.current);
			}
			else {
				// eslint-disable-next-line no-param-reassign
				ref.current = targetRef.current;
			}
		});
	}, [refs]);
	return targetRef;
}

const AccordionContainerEl = styled(Container)`
	padding: ${(props) => `
		${props.level === 0 ? props.theme.sizes.padding.large : props.theme.sizes.padding.medium}
		${props.theme.sizes.padding.large}
		${props.level === 0 ? props.theme.sizes.padding.large : props.theme.sizes.padding.medium}
		calc(${props.theme.sizes.padding.large} + ${props.level > 1 ? props.theme.sizes.padding.medium : '0px'})
	`};
	${({ theme }) => pseudoClasses(theme, 'gray5')};
`;

const Accordion = React.forwardRef(({
	id, label, items, iconColor, isChecked = undefined, check,
	level,
	expanded = true,
	click = undefined,
	...rest
}, ref) => {
	const [open, setOpen] = useState(expanded);
	const innerRef = useRef(undefined);
	const accordionRef = useCombinedRefs(ref, innerRef);
	const isMobile = useScreenMode() === 'mobile';

	const handleClick = useCallback((e) => {
		setOpen(true);
		if (isMobile && click) click(id);
	}, [isMobile, click, id]);
	const expandOnIconClick = useCallback((e) => {
		e.stopPropagation();
		setOpen((isOpen) => !isOpen);
	}, [setOpen]);

	const keyEvents = useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	useKeyboard(accordionRef, keyEvents);

	const updateChecked = useCallback((ev) => {
		ev.stopPropagation();
		check(!isChecked);
	}, [check, isChecked]);

	return (
		<Container
			orientation="vertical"
			width="fill"
			height="fit"
			background="gray5"
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			<AccordionContainerEl
				ref={accordionRef}
				level={level}
				onClick={handleClick}
				orientation="horizontal"
				width="fill"
				height="fit"
				mainAlignment="space-between"
				tabIndex={0}
			>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					padding={{ right: 'small' }}
					style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
				>

					<Responsive mode="desktop">
						<Padding right="medium">
							<Checkbox
								value={isChecked}
								onClick={updateChecked}
								iconColor="primary"
							/>
						</Padding>
					</Responsive>

					<Padding right="small">
						<Icon icon="Calendar2" customColor={iconColor} size="large" />
					</Padding>

					<Text
						size="large"
						weight="bold"
						style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
					>
						{ label }
					</Text>
				</Container>
				{ items.length > 0
				&& (
					<IconButton
						customSize={{ iconSize: 'large', paddingSize: 0 }}
						onClick={expandOnIconClick}
						icon={open ? 'ArrowIosUpward' : 'ArrowIosDownward'}
						style={{ cursor: 'pointer' }}
					/>
				) }
			</AccordionContainerEl>
			<Collapse
				crossSize="100%"
				orientation="vertical"
				open={open}
				maxSize={`${items.length * 64}px`}
			>
				<Container
					orientation="vertical"
					height="fit"
					width="fill"
					crossAlignment="flex-start"
				>
					{ items.length > 0
					&& items.map((item) => (item.items.length > 0
						? (
							<Accordion
								id={item.id}
								key={item.id}
								level={level + 1}
								label={item.label}
								items={item.items}
								isChecked={item.isChecked}
								check={item.check}
								iconColor={item.iconColor}
								expanded={item.expanded}
								click={click}
							/>
						)
						: (
							<AccordionItem
								id={item.id}
								key={item.id}
								level={level + 1}
								label={item.label}
								isChecked={item.isChecked}
								check={item.check}
								iconColor={item.iconColor}
								parentId={item.parentId}
								click={click}
							/>
						))) }
				</Container>
			</Collapse>
		</Container>
	);
});

const ItemContainerEl = styled(Container)`
	padding: ${(props) => `
		${props.theme.sizes.padding.medium}
		calc(${props.theme.sizes.padding.large} + ${props.theme.sizes.icon.large} + ${props.theme.sizes.padding.small})
		${props.theme.sizes.padding.medium} calc(${props.theme.sizes.padding.large} + ${props.level > 1 ? props.theme.sizes.padding.medium : '0px'})`};
	${({ theme }) => pseudoClasses(theme, 'gray5')};

`;

const AccordionItem = ({
	id, label, level, isChecked, check, iconColor, click
}) => {
	const isMobile = useScreenMode() === 'mobile';

	const updateChecked = useCallback((ev) => {
		ev.stopPropagation();
		check(!isChecked);
	}, [check, isChecked]);

	const onClick = useCallback(() => {
		if (click) click(id);
	}, [click, id]);

	return (
		<Container width="fill">
			<ItemContainerEl
				level={level}
				orientation="horizontal"
				width="fill"
				mainAlignment="flex-start"
				tabIndex={0}
				onClick={isMobile ? onClick : undefined}
			>
				<Responsive mode="desktop">
					<Padding right="medium">
						<Checkbox
							value={isChecked}
							onClick={updateChecked}
							iconColor="primary"
						/>
					</Padding>
				</Responsive>
				<Padding right="small">
					<Icon icon="Calendar2" customColor={iconColor} size="large" />
				</Padding>
				<Text
					size="large"
					weight="bold"
					style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
				>
					{ label }
				</Text>
			</ItemContainerEl>
		</Container>
	);
};

export default Accordion;
