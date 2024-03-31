import { LINK_FILTERS } from '$lib/constants'
import { changeVisibility, deleteShortLink } from '$lib/services/api'
import type { LinkFilterValues, LinkType } from '$lib/types'
import toast from 'svelte-french-toast'
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

	function deleteShorLink({ shortLink }: { shortLink: string }) {
		deleteShortLink({ shortLink })
			.then((deleted) => {
				if (deleted === false) {
					throw new Error('Error deleting link')
				}

				linkStore.update((state) => ({
					...state,
					links: state.links.filter((link) => link.shortLink !== shortLink)
				}))
				toast.success('Link deleted successfully')
			})
			.catch(() => {
				toast.error('Error deleting link, try again later.')
			})
	}

	function updateVisibility({ shortLink, isPublic }: { shortLink: string; isPublic: boolean }) {
		linkStore.update((state) => {
			const link = state.links.find((link) => link.shortLink === shortLink)

			if (!link) return state

			link.isPublic = isPublic

			return {
				...state,
				links: state.links.map((l) => (l.shortLink === shortLink ? link : l))
			}
		})

		changeVisibility({ shortLink, isPublic })
			.then((updated) => {
				if (updated === false) {
					throw new Error('Error updating visibility')
				}
				toast.success('Visibility updated successfully')
			})
			.catch(() => {
				toast.error('Error updating visibility, try again later.')
				linkStore.update((state) => {
					const link = state.links.find((link) => link.shortLink === shortLink)

					if (!link) return state

					link.isPublic = !isPublic

					return {
						...state,
						links: state.links.map((l) => (l.shortLink === shortLink ? link : l))
					}
				})
			})
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
		deleteShorLink,
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
