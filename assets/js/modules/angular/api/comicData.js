// @flow
/*
 * Copyright (C) 2016-2018 Alexander Krivács Schrøder <alexschrod@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { ItemType } from './itemData';

export type ComicEditorDataMissing = {
	first: ?number;
	previous: ?number;
	next: ?number;
	last: ?number;
	any: boolean;
}

export type ComicEditorData = {
	missing: {
		cast: ComicEditorDataMissing;
		location: ComicEditorDataMissing;
		storyline: ComicEditorDataMissing;
		title: ComicEditorDataMissing;
		tagline: ComicEditorDataMissing;
		any: boolean;
	}
};

export type ComicItem = {
	first: ?number;
	previous: ?number;
	first: ?number;
	last: ?number;
	id: number;
	shortName: string;
	name: string;
	type: ItemType;
	color: string;
};

export type ComicData = {
	comic: number;
	hasData: boolean;
	publishDate: ?string;
	isAccuratePublishDate: ?boolean;
	title: ?string;
	tagline: ?string;
	isGuestComic: ?boolean;
	isNonCanon: ?boolean;
	news: ?string;
	previous: ?number;
	next: ?number;
	editorData?: ComicEditorData;
	items: Array<ComicItem>;
	allItems?: Array<ComicItem>;
};

export type ComicItemRepository = {
	[string]: ComicItem[];

	cast?: ComicItem[];
	location?: ComicItem[];
	storyline?: ComicItem[];
}
