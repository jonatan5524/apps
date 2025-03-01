/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('./tailwind/colors');
const overlay = require('./tailwind/overlay');
const boxShadow = require('./tailwind/boxShadow');
const caret = require('./tailwind/caret');
const typography = require('./tailwind/typography');
const buttons = require('./tailwind/buttons');

module.exports = {
  theme: {
    colors: {
      ...colors,
      overlay,
      theme: {
        active: 'var(--theme-active)',
        focus: 'var(--theme-focus)',
        float: 'var(--theme-float)',
        hover: 'var(--theme-hover)',
        rank: 'var(--rank-color)',
        bg: {
          primary: 'var(--theme-background-primary)',
          secondary: 'var(--theme-background-secondary)',
          tertiary: 'var(--theme-background-tertiary)',
          bun: 'var(--theme-background-bun)',
          onion: 'var(--theme-background-onion)',
          mention: {
            primary: 'var(--theme-mention)',
            hover: 'var(--theme-mention-hover)',
          },
        },
        label: {
          primary: 'var(--theme-label-primary)',
          secondary: 'var(--theme-label-secondary)',
          tertiary: 'var(--theme-label-tertiary)',
          quaternary: 'var(--theme-label-quaternary)',
          disabled: 'var(--theme-label-disabled)',
          link: 'var(--theme-label-link)',
          invert: 'var(--theme-label-invert)',
          bacon: 'var(--theme-label-bacon)',
        },
        divider: {
          primary: 'var(--theme-divider-primary)',
          secondary: 'var(--theme-divider-secondary)',
          tertiary: 'var(--theme-divider-tertiary)',
          quaternary: 'var(--theme-divider-quaternary)',
        },
        overlay: {
          quaternary: 'var(--theme-overlay-quaternary)',
          water: 'var(--theme-overlay-water)',
        },
        status: {
          error: 'var(--theme-status-error)',
          help: 'var(--theme-status-help)',
          fill: 'var(--theme-status-fill)',
          success: 'var(--theme-status-success)',
          warning: 'var(--theme-status-warning)',
          cabbage: 'var(--theme-status-cabbage)',
        },
        color: {
          burger: 'var(--theme-color-burger)',
          blueCheese: 'var(--theme-color-blueCheese)',
          avocado: 'var(--theme-color-avocado)',
          lettuce: 'var(--theme-color-lettuce)',
          cheese: 'var(--theme-color-cheese)',
          bun: 'var(--theme-color-bun)',
          ketchup: 'var(--theme-color-ketchup)',
          bacon: 'var(--theme-color-bacon)',
          cabbage: 'var(--theme-color-cabbage)',
          onion: 'var(--theme-color-onion)',
          water: 'var(--theme-color-water)',
          salt: 'var(--theme-color-salt)',
        },
        'post-disabled': 'var(--theme-post-disabled)',
        highlight: {
          comment: 'var(--theme-highlight-comment)',
          red: 'var(--theme-highlight-red)',
          orange: 'var(--theme-highlight-orange)',
          yellow: 'var(--theme-highlight-yellow)',
          green: 'var(--theme-highlight-green)',
          aqua: 'var(--theme-highlight-aqua)',
          blue: 'var(--theme-highlight-blue)',
          purple: 'var(--theme-highlight-purple)',
          label: 'var(--theme-highlight-label)',
        },
      },
      white: '#ffffff',
      transparent: 'transparent',
    },
    boxShadow,
    opacity: {
      0: '0',
      40: '0.4',
      50: '0.5',
      64: '0.64',
      100: '1',
    },
    zIndex: {
      0: '0',
      1: '1',
      2: '2',
      3: '3',
      rank: '3',
      '-1': '-1',
    },
    maxHeight: {
      'img-desktop': '400px',
      'img-mobile': '280px',
      'rank-modal': 'calc(100vh - 5rem)',
    },
    fontFamily: {
      sans: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        'Helvetica',
        'Ubuntu',
        'Segoe UI',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
      ],
    },
    screens: {
      mobileL: '420px',
      tablet: '656px',
      laptop: '1020px',
      laptopL: '1360px',
      laptopXL: '1668px',
      desktop: '1976px',
      desktopL: '2156px',
      mouse: { raw: '(pointer: fine)' },
      responsiveModalBreakpoint: '420px',
    },
    extend: {
      borderRadius: {
        2: '0.125rem',
        3: '0.1875rem',
        6: '0.375rem',
        8: '0.5rem',
        10: '0.625rem',
        12: '0.75rem',
        14: '0.875rem',
        16: '1rem',
        26: '1.625rem',
      },
      opacity: {
        24: '0.24',
        32: '0.32',
      },
      inset: {
        'screen-20': '20vh',
        'screen-40': '40vh',
        'screen-60': '60vh',
        'screen-80': '80vh',
        screen: '100vh',
      },
      spacing: {
        22: '5.5rem',
        70: '17.5rem',
      },
      width: {
        70: '17.5rem',
      },
      height: {
        logo: '1.125rem',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [caret, typography, buttons, require('@tailwindcss/line-clamp')],
  corePlugins: {
    invert: false,
  },
};
