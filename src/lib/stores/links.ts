import { LINK_FILTERS } from '$lib/constants'
import type { LinkFilterValues, LinkType } from '$lib/types'
import { writable } from 'svelte/store'

export interface LinkStoreModel<T extends Record<PropertyKey, any>> {
	links: T[]
	filtered: T[]
	filterBy: LinkFilterValues
	search: string
}

export const createLinkStore = <T extends Record<PropertyKey, any>>(initialValue: T[]) => {
	const linkStore = writable<LinkStoreModel<T>>({
		links: initialValue,
		filtered: initialValue,
		filterBy: LINK_FILTERS.ALL,
		search: ''
	})

	function remove({ linkId }: { linkId: string }) {
		linkStore.update((state) => ({
			...state,
			links: state.links.filter((link) => link._id !== linkId)
		}))
	}

	function updateVisibility({ linkId, isPublic }: { linkId: string; isPublic: boolean }) {
		linkStore.update((state) => ({
			...state,
			links: state.links.map((link) => {
				if (link._id === linkId) {
					return {
						...link,
						isPublic
					}
				}

				return link
			})
		}))
	}

	function clearFilters() {
		linkStore.update((state) => ({
			...state,
			filterBy: LINK_FILTERS.ALL,
			search: ''
		}))
	}

	return {
		...linkStore,
		remove,
		updateVisibility,
		clearFilters
	}
}

export const searchHandler = (store: LinkStoreModel<LinkType>) => {
	const searchTerm = store.search.toLowerCase()

	store.filtered = store.links.filter((link) => {
		if (store.filterBy === LINK_FILTERS.ALL) return true
		if (store.filterBy === LINK_FILTERS.PUBLIC) return link.isPublic
		if (store.filterBy === LINK_FILTERS.PRIVATE) return !link.isPublic
	})

	store.filtered = store.filtered.filter((link) => {
		const shortLink = link.shortLink.toLowerCase()
		const originalLink = link.link.toLowerCase()

		return shortLink.includes(searchTerm) || originalLink.includes(searchTerm)
	})
}
