import { useArgs } from 'storybook/preview-api'

import ModalDialogSeat from '@modals/ModalDialogSeat/ModalDialogSeat'
import type { Meta, StoryObj } from '@storybook/react-vite'

import ModalPageOverlay from './ModalPageOverlay'

const meta: Meta<typeof ModalPageOverlay> = {
    component: ModalPageOverlay,
    args: {
        show: true,
    },
    render: (args) => {
        const [, setArgs] = useArgs()
        return (
            <>
                <ModalPageOverlay {...args} />
                <ModalDialogSeat
                    show={args.show}
                    onClick={() => setArgs({ show: false })}
                >
                    <dialog
                        className={
                            'p-2 border-none shadow-lg flex flex-col pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current w-150'
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
    },
}
export default meta

type Story = StoryObj<typeof ModalPageOverlay>

export const Default: Story = {}
