import { LINK_FILTERS } from '$lib/constants'
import type Link from '$lib/server/models/link'
import { changeVisibility, deleteShortLink, updateLink, updateShortLink } from '$lib/services/api'
import type { LinkFilterValues } from '$lib/types'
import toast from 'svelte-french-toast'
import { writable } from 'svelte/store'

export interface LinkStoreModel {
	links: Array<Link>
	filtered: Array<Link>
	filterBy: LinkFilterValues
	search: string
}

export const createLinkStore = (initialValue: Array<Link>) => {
	const linkStore = writable<LinkStoreModel>({
		links: initialValue,
		filtered: initialValue,
		filterBy: LINK_FILTERS.ALL,
		search: ''
	})

	function deleteShorLink({ shortLink }: Pick<Link, 'shortLink'>) {
		const deletePromise = async function () {
			const deleted = await deleteShortLink({ shortLink })

			if (deleted === false) {
				throw new Error('Error deleting link')
			}

			linkStore.update((state) => ({
				...state,
				links: state.links.filter((link) => link.shortLink !== shortLink)
			}))
		}

		toast.promise(deletePromise(), {
			loading: 'Deleting link...',
			success: 'Link deleted successfully!',
			error: 'Error deleting link, try again later.'
		})
	}

	function updateVisibility({ shortLink, isPublic }: Pick<Link, 'shortLink' | 'isPublic'>) {
		linkStore.update((state) => {
			const link = state.links.find((link) => link.shortLink === shortLink)

			if (!link) return state

			link.isPublic = isPublic

			return {
				...state,
				links: state.links.map((l) => (l.shortLink === shortLink ? link : l))
			}
		})

		const updatePromise = async function () {
			const updated = await changeVisibility({ shortLink, isPublic })

			if (updated === true) {
				return
			}
			linkStore.update((state) => {
				const link = state.links.find((link) => link.shortLink === shortLink)

				if (!link) return state

				link.isPublic = !isPublic

				return {
					...state,
					links: state.links.map((l) => (l.shortLink === shortLink ? link : l))
				}
			})
			throw new Error('Error updating visibility')
		}

		toast.promise(updatePromise(), {
			loading: 'Updating visibility...',
			success: 'Visibility updated successfully',
			error: 'Error updating visibility, try again later.'
		})
	}

	function editLink({
		link: newLink,
		shortLink
	}: Pick<Link, 'link'> & { shortLink: Link['shortLink'] }) {
		const updatePromise = async function () {
			const success = await updateLink({ link: newLink, shortLink })

			if (success === false) {
				throw new Error('Error updating link')
			}

			linkStore.update((state) => {
				const link = state.links.find((l) => l.shortLink === shortLink)

				if (!link) return state

				const newObj = { ...link, link: newLink }

				return {
					...state,
					links: state.links.map((l) => (l.shortLink === shortLink ? newObj : l))
				}
			})
		}

		toast.promise(updatePromise(), {
			loading: 'Updating link...',
			success: 'Link updated successfully',
			error: 'Error updating link, try again later.'
		})
	}

	function editShortLink({
		shortLink,
		newShortLink
	}: Pick<Link, 'shortLink'> & { newShortLink: Link['shortLink'] }) {
		const updatePromise = async function () {
			const updated = await updateShortLink({ newShortLink, shortLink })

			if (updated === false) {
				throw new Error('Error updating link')
			}

			linkStore.update((state) => {
				const link = state.links.find((l) => l.shortLink === shortLink)

				if (!link) return state

				const newObj = { ...link, shortLink: newShortLink }

				return {
					...state,
					links: state.links.map((l) => (l.shortLink === shortLink ? newObj : l))
				}
			})
		}

		toast.promise(updatePromise(), {
			loading: 'Updating shortLink...',
			success: 'shortLink updated successfully!',
			error: 'Error updating shortLink, try again later.'
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
		editLink,
		editShortLink,
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
