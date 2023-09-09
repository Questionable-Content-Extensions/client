import { PaddedButton } from '@components/Button'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ModalDialog from './ModalDialog'

export default {
    component: ModalDialog,
    argTypes: {
        onCloseClicked: { action: 'close-clicked' },
        header: {
            table: {
                disable: true,
            },
        },
        body: {
            table: {
                disable: true,
            },
        },
        footer: {
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof ModalDialog>

const Template: ComponentStory<typeof ModalDialog> = (args) => (
    <ModalDialog {...args} />
)

export const Default = Template.bind({})
Default.args = {
    header: (
        <h1 className="m-0 text-xl font-medium leading-normal text-gray-800">
            Header
        </h1>
    ),
    body: (
        <>
            <p>
                Aperiam animi est ut cupiditate vitae beatae. Dolores
                consequatur quibusdam natus saepe et iure impedit molestiae. Et
                aut omnis eum velit.
            </p>

            <p>
                Alias veritatis perspiciatis eligendi consequuntur vero ullam.
                Laborum sunt beatae ipsa. Ut molestias eum adipisci. Excepturi
                tempore in omnis dolor.
            </p>

            <p>
                Amet error repellat non doloremque modi deserunt. Impedit
                voluptatum optio dolorem odio nisi. Perferendis aliquam omnis
                eos qui qui error sequi. Nostrum et eius facilis ut ut iusto
                eveniet. Quasi laborum eos culpa in. Dolor laborum delectus non
                ut.
            </p>

            <p>
                Maiores illo incidunt ipsa. Veniam non sint perspiciatis odit
                nihil adipisci vero praesentium. Ipsa consequatur distinctio
                nisi qui omnis architecto.
            </p>

            <p>
                Dolor sit culpa quasi quo architecto. Reiciendis soluta facere
                eum nemo maiores consequatur ipsa. Esse quaerat culpa eligendi
                sed enim cupiditate adipisci.
            </p>
        </>
    ),

    footer: (
        <>
            <PaddedButton>Button 1</PaddedButton>

            <PaddedButton>Button 2</PaddedButton>
        </>
    ),
}
