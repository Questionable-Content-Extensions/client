// @flow
/*
 * Copyright (C) 2016-2019 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

export type ItemType = 'cast' | 'location' | 'storyline';

export type ItemBaseData = {
	id: number;
	shortName: string;
	name: string;
	type: ItemType;
}

export type ItemBaseDataWithColor = ItemBaseData & {
	color: string;
}

export type ItemData = ItemBaseDataWithColor & {
	first: number;
	last: number;
	appearances: number;
	totalComics: number;
	presence: number;
	hasImage: boolean;
};

export type ItemRelationData = ItemBaseDataWithColor & {
	count: number;
	percentage: number;
};

export type DecoratedItemData = ItemData & {
	highlightColor: string;
	locations: ItemRelationData[];
	friends: ItemRelationData[];
	imageUrls: string[];
};

export type ItemImageData = {
	id: number;
	crC32CHash: number;
};
