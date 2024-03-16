import themes from 'daisyui/src/theming/themes'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
    themes: [
      {
        light: {
          ...themes.light,
          primary: '#8564c9',
          'primary-content': '#F7F4FB',
          secondary: '#f480cc',
          'secondary-content': '#ffffff',
          accent: '#ef4484',
          'accent-content': '#fff',
          neutral: '#3d4451',
          '--shadow': '#00000030',
          'neutral-content': '#130b21',
          'base-100': '#f7effd',
          'base-200': '#f9fafb',
          'base-300': '#ffffff',
          'base-content': '#130b21',
          '.bg-gradient': {
            position: 'fixed',
            top: '0',
            left: '0',
            'z-index': '-2',
            height: '100vh',
            width: '100vw',
            'background-color': '#ffffff',
            'background-image': 'radial-gradient(ellipse 80% 80% at 50% -20%,rgb(248, 239, 253),rgb(249,250,251))'
          }
        }
      },
      {
        dark: {
          ...themes.dark,
          primary: '#8564c9',
          'primary-content': '#F7F4FB',
          secondary: '#F7A6DB',
          'secondary-content': '#ffffff',
          accent: '#BEACE2',
          'accent-content': '#14040c',
          neutral: '#3d4451',
          'neutral-content': '#cbd5e1',
          'base-100': '#0f0526',
          'base-200': '#140f1e',
          'base-300': '#1e1933',
          'base-content': '#cbd5e1',
          '--shadow': '#ffffff15',
          '.bg-gradient': {
            position: 'fixed',
            top: '0',
            left: '0',
            'z-index': '-2',
            height: '100vh',
            width: '100vw',
            'background-color': '#140f1e',
            'background-image': 'radial-gradient(ellipse 80% 80% at 50% -20%,rgba(120,119,198,0.3),rgba(255,255,255,0))'
          }
        }
      }
    ]
  }
}
