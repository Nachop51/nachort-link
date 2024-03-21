import { LINK_FILTERS } from '$lib/constants'
import type { LinkFilterValues, LinkType } from '$lib/types'
import { writable } from 'svelte/store'

export interface LinkStoreModel {
	links: Array<LinkType>
	filtered: Array<LinkType>
	filterBy: LinkFilterValues
	search: string
}

export const createLinkStore = (initialValue: Array<LinkType>) => {
	const linkStore = writable<LinkStoreModel>({
		links: initialValue,
		filtered: initialValue,
		filterBy: LINK_FILTERS.ALL,
		search: ''
	})

	function remove({ shortLink }: { shortLink: string }) {
		linkStore.update((state) => ({
			...state,
			links: state.links.filter((link) => link.shortLink !== shortLink)
		}))
	}

	function updateVisibility({ shortLink, isPublic }: { shortLink: string; isPublic: boolean }) {
		linkStore.update((state) => ({
			...state,
			links: state.links.map((link) => {
				if (link.shortLink === shortLink) {
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

export const searchHandler = (store: LinkStoreModel) => {
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
