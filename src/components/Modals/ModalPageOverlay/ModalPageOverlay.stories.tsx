import ModalDialogSeat from '@modals/ModalDialogSeat/ModalDialogSeat'
import { useArgs } from '@storybook/preview-api'
import { Meta, StoryFn } from '@storybook/react'

import ModalPageOverlay from './ModalPageOverlay'

export default {
    component: ModalPageOverlay,
} as Meta<typeof ModalPageOverlay>

const Template: StoryFn<typeof ModalPageOverlay> = (args) => {
    const [_args, setArgs] = useArgs()
    return (
        <>
            <ModalPageOverlay {...args} />
            <ModalDialogSeat
                show={args.show}
                onClick={() => setArgs({ show: false })}
            >
                <dialog
                    className={
                        'p-2 border-none shadow-lg flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current w-[600px]'
                    }
                    aria-modal
                >
                    Example content, heave ho!
                </dialog>
            </ModalDialogSeat>
            <div className="grid grid-rows-2 h-full w-full fixed top-0 left-0 place-content-center place-items-center">
                <p className="text-5xl">
                    Background text to illustrate blurring
                </p>
                <p className="text-5xl">
                    Background text to illustrate blurring
                </p>
            </div>
        </>
    )
}

export const Default = Template.bind({})
Default.args = {
    show: true,
}
