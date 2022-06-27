/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const accountListDirectory = async (
	attr: string,
	type: string,
	domainName: string | undefined,
	query: string,
	offset: number,
	limit: number
): Promise<any> => {
	const request: any = {
		SearchDirectoryRequest: {
			_jsns: 'urn:zimbraAdmin',
			offset,
			limit,
			sortAscending: '1',
			applyCos: 'false',
			applyConfig: 'false',
			attrs: attr,
			types: type
		}
	};
	if (domainName && domainName !== '') {
		request.SearchDirectoryRequest.domain = domainName;
	}
	if (query !== '') {
		request.SearchDirectoryRequest.query = query;
	}
	return fetch(`/service/admin/soap/SearchDirectoryRequest`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Header: {
				context: {
					_jsns: 'urn:zimbra',
					session: {}
				}
			},
			Body: request
		})
	});
};

export const createAccountRequest = async (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attr: Array<any>,
	name: string,
	password: string
): Promise<any> => {
	const attrList: { n: string; _content: string }[] = [];
	Object.keys(attr).map((ele: any) => attrList.push({ n: ele, _content: attr[ele] }));
	const request: any = {
		CreateAccountRequest: {
			_jsns: 'urn:zimbraAdmin',
			name,
			password,
			a: attrList
		}
	};

	return fetch(`/service/admin/soap/CreateAccountRequest`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Header: {
				context: {
					_jsns: 'urn:zimbra',
					session: {}
				}
			},
			Body: request
		})
	});
};

export const getMailboxQuota = async (id: string): Promise<any> => {
	const request: any = {
		GetMailboxRequest: {
			_jsns: 'urn:zimbraAdmin',
			mbox: {
				id
			}
		}
	};
	return fetch(`/service/admin/soap/GetMailboxRequest`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Body: request
		})
	});
};
