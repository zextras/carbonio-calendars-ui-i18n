/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
	filter, forEach, get, reduce
} from 'lodash';
import { useTranslation } from 'react-i18next';
import { Container, Text } from '@zextras/zapp-ui';

const _CI_REGEX = /^<(.*)>$/;
const _CI_SRC_REGEX = /^cid:(.*)$/;

function TextMessageRenderer({ text }) {
	const containerRef = useRef();

	useEffect(() => {
		containerRef.current.innerText = text;
	}, [text]);

	return (<Text ref={containerRef} />);
}

function HtmlMessageRenderer({ msgId, body, parts }) {
	const iframeRef = useRef();
	const onIframeLoad = useCallback((ev) => {
		ev.persist();
		const styleTag = document.createElement('style');
		const styles = `
			body {
				margin: 0;
				overflow-y: hidden;
				font-family: Roboto, sans-serif;
				font-size: 14px;
			}
			body pre, body pre * {
				white-space: pre-wrap;
				word-wrap: break-word !important;
				text-wrap: suppress !important;
			}
			img {
				max-width: 100%
			}
		`;
		styleTag.textContent = styles;
		iframeRef.current.contentDocument.head.append(styleTag);
		iframeRef.current.style.display = 'block';
		iframeRef.current.style.height = `${iframeRef.current.contentDocument.body.querySelector('div').scrollHeight}px`;
	}, []);

	useEffect(() => {
		iframeRef.current.contentDocument.open();
		iframeRef.current.contentDocument.write(`<div>${body}</div>`);
		iframeRef.current.contentDocument.close();
		const imgMap = reduce(
			parts,
			(r, v, k) => {
				if (!_CI_REGEX.test(v.ci)) return r;
				r[_CI_REGEX.exec(v.ci)[1]] = v;
				return r;
			},
			{}
		);

		const images = iframeRef.current.contentDocument.body.getElementsByTagName('img');

		forEach(
			images,
			(p, k) => {
				if (p.hasAttribute('dfsrc')) {
					p.setAttribute('src', p.getAttribute('dfsrc'));
				}
				if (!_CI_SRC_REGEX.test(p.src)) return;
				const ci = _CI_SRC_REGEX.exec(p.getAttribute('src'))[1];
				if ({}.hasOwnProperty.call(imgMap, ci)) {
					const part = imgMap[ci];
					p.setAttribute('pnsrc', p.getAttribute('src'));
					p.setAttribute('src', `/service/home/~/?auth=co&id=${msgId}&part=${part.name}`);
				}
			}
		);
	}, [body, parts, msgId]);

	return (
		<iframe
			title={msgId}
			ref={iframeRef}
			onLoad={onIframeLoad}
			style={{ border: 'none', width: '100%', display: 'none' }}
		/>
	);
}

const EmptyBody = () => {
	const { t } = useTranslation();

	return (
		<Container padding={{ bottom: 'medium' }}><Text>{`(${t('This invite has no text message')}.)`}</Text></Container>
	);
}

const divider = '*~*~*~*~*~*~*~*~*~*';
function extractBody(body) {
	if (body) {
		const lastElement = body.split(divider).pop();
		return lastElement.trim();
	}
	return null;
}

function extractHtmlBody(body) {
	let htmlBody = extractBody(body);
	if (htmlBody.startsWith('</div>')) {
		htmlBody = `<html>${htmlBody.slice(10)}`;
	}
	return htmlBody;
}

export default function BodyMessageRenderer({ fullInvite, inviteId, parts }) {
	if (!fullInvite) return null;

	if (typeof fullInvite.fr === 'undefined') {
		return <EmptyBody />;
	}
	if (fullInvite.descHtml) {
		return (
			<HtmlMessageRenderer
				msgId={inviteId}
				body={extractHtmlBody(fullInvite.descHtml[0]._content)}
				parts={parts}
			/>
		);
	}
	return (<TextMessageRenderer text={extractBody(fullInvite.desc[0]._content)} />);
}
