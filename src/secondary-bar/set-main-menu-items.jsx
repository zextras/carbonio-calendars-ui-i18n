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

/* eslint no-param-reassign: ["error", {"props": true, "ignorePropertyModificationsFor": ["c"] }] */

import React, { useCallback, useEffect } from 'react';
import { setMainMenuItems } from '@zextras/zapp-shell';
import { useDispatch, useSelector } from 'react-redux';
import {
	remove, reduce, forEach, map, filter, every
} from 'lodash';
import { useTranslation } from 'react-i18next';
import { checkUncheckCalendar, selectAllFolders } from '../store/calendars-slice';
import Accordion from './accordion-calendar';

export default function SetMainMenuItems() {
	useSetMainMenuItems();
	return null;
}

const nest = (items, id) =>
	map(
		filter(items, (item) => item.parentId === id),
		(item) => ({ ...item, items: nest(items, item.id) })
	);

const foreachForTree = (item, fn) => {
	fn(item);
	forEach(item.items, fn);
};

function useSetMainMenuItems() {
	const { t } = useTranslation();
	const allCalendars = useSelector(selectAllFolders);
	const dispatch = useDispatch();

	const checkUncheckCalendarCbk = useCallback((data) =>
		dispatch(checkUncheckCalendar(data)), [dispatch]);

	const setSelected = useCallback((c, value) => {
		if (c.isChecked !== value) {
			checkUncheckCalendarCbk({ zid: c.id, checked: value });
			c.isChecked = value;
		}
	}, [checkUncheckCalendarCbk]);

	const setSelectedRecursive = useCallback((c, value) =>
		foreachForTree(c, (tree) => setSelected(tree, value)), [setSelected]);

	const findAndSetSelected = useCallback((clickedId, currentElement) => {
		if (currentElement.id === clickedId) setSelectedRecursive(currentElement, true);
		else {
			setSelected(currentElement, false);
			forEach(currentElement.items, (el) => findAndSetSelected(clickedId, el));
		}
	}, [setSelected, setSelectedRecursive]);

	const calendars = reduce(allCalendars, (a, c) => {
		a.push({
			icon: 'Calendar2',
			id: c.zid,
			parentId: c.parentZid,
			label: c.name,
			items: c.items || [],
			isChecked: c.checked,
			iconColor: c.color.color,
		});
		return a;
	}, []);

	useEffect(() => {
		const nestedCalendars = nest(calendars, '1');
		const trashItem = remove(nestedCalendars, (c) => c.id === '3'); // move Trash folder to the end
		const allItems = nestedCalendars.concat(trashItem);

		const click = (id) => forEach(allItems, (c) => findAndSetSelected(id, c));
		const clickOnTrash = (id) => {
			click(id);
			// TODO: show the bottom panel of Trash
		};
		forEach(allItems, (tree) =>
			foreachForTree(tree, ((c) => {
				c.check = (value) => setSelectedRecursive(c, value);
			})));

		const accordions = map(allItems, (folder) => (
			<Accordion
				id={folder.id}
				key={folder.id}
				label={folder.label}
				isChecked={folder.isChecked}
				items={folder.items}
				check={folder.check}
				iconColor={folder.iconColor}
				click={folder.id !== '3' ? click : clickOnTrash}
				expanded
			/>
		),);

		if (calendars.length > 2) {
			const checkAll = (value, uncheckThrash = false) =>
				forEach(
					nestedCalendars,
					(c) => {
						if (c.id !== '3') setSelectedRecursive(c, value);
						else if (uncheckThrash) setSelectedRecursive(c, false);
					}
				);

			accordions.unshift(
				<Accordion
					key="0"
					label={t('All Calendars')}
					items={[]}
					isChecked={
						every(
							filter(nestedCalendars, (c) => c.id !== '3'),
							(c) => c.isChecked
						)
					}
					check={checkAll}
					click={() => checkAll(true, true)}
				/>
			);
		}

		setMainMenuItems([{
			id: 'calendar-main',
			icon: 'CalendarOutline',
			to: '/view',
			label: 'calendar',
			customComponent:
	<>
		{ accordions }
	</>,
		}]);
	}, [calendars, findAndSetSelected, setSelectedRecursive, t]);
}
