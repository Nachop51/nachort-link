import { TOAST_DURATIONS } from '$lib/constants'
import toast from 'svelte-french-toast'

export const copyWithToast = ({ text }: { text: string }) => {
	if (text == null) {
		toast.error('Nothing to copy')
		return
	}

	navigator.clipboard.writeText(text)
	toast.success('Copied to clipboard', {
		iconTheme: {
			primary: '#09f',
			secondary: '#fff'
		},
		duration: TOAST_DURATIONS.SHORT
	})
}
