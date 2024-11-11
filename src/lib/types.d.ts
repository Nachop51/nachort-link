import type { LINK_FILTERS } from './constants'

export enum THEME {
	LIGHT = 'light',
	DARK = 'dark'
}

export type LinkFilterValues = (typeof LINK_FILTERS)[keyof typeof LINK_FILTERS]
