import './qc.css'
import '~/index.css'

import { setup } from '~/utils'

setup(true)

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
}
