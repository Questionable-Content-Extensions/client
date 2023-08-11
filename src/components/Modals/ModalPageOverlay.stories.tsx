import { ComponentMeta, ComponentStory } from '@storybook/react'

import ModalPageOverlay from './ModalPageOverlay'

export default {
    component: ModalPageOverlay,
} as ComponentMeta<typeof ModalPageOverlay>

const Template: ComponentStory<typeof ModalPageOverlay> = (args) => (
    // <div
    //     className={
    //         'inline-block shadow m-auto' + (args.visible ? '' : ' hidden')
    //     }
    // >
    <>
        <ModalPageOverlay {...args} />
        <div
            className={
                'fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto grid place-items-center' +
                (args.show ? ' block' : ' hidden')
            }
            style={{ zIndex: 2000 }}
            //onClick={() => setShowComicPickerModal(false)}
        >
            <dialog
                className={
                    'p-2 border-none shadow-lg flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current w-[600px]'
                }
                aria-modal
            >
                Example content, heave ho!
            </dialog>
        </div>
    </>
    //</div>
)

export const Default = Template.bind({})
Default.args = {
    show: true,
}
