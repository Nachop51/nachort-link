import themes from 'daisyui/src/theming/themes'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				light: {
					...themes.light,
					primary: '#7d2ae8',
					'primary-content': '#fff',
					secondary: '#ff7ed4',
					'secondary-content': '#ffffff',
					accent: '#ff3ea5',
					'accent-content': '#fff',
					neutral: '#f7effd',
					'--shadow': '#00000030',
					'neutral-content': '#130b21',
					'base-100': '#f7effd',
					'base-200': '#f3e7fd',
					'base-300': '#e0d0f5',
					'base-content': '#33135B',
					'.bg-gradient': {
						position: 'fixed',
						top: '0',
						left: '0',
						'z-index': '-2',
						height: '100vh',
						width: '100vw',
						'background-color': '#ffffff',
						'background-image':
							'radial-gradient(ellipse 80% 80% at 50% -20%,rgb(248, 239, 253),rgb(249,250,251))'
					}
				}
			},
			{
				dark: {
					...themes.dark,
					primary: '#6c51e2',
					'primary-content': '#f4f2fd',
					secondary: '#BC52E3',
					'secondary-content': '#ffffff',
					accent: '#aeaaff',
					'accent-content': '#0e0d2a',
					neutral: '#17073b',
					'neutral-content': '#ffffff',
					'--shadow': '#ffffff15',
					'base-100': '#0f0526',
					'base-200': '#140f1e',
					'base-300': '#1e1933',
					'base-content': '#cbd5e1',
					'.bg-gradient': {
						position: 'fixed',
						top: '0',
						left: '0',
						'z-index': '-2',
						height: '100vh',
						width: '100vw',
						'background-color': '#140f1e',
						'background-image':
							'radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),rgba(255,255,255,0))'
					}
				}
			}
		]
	}
}
