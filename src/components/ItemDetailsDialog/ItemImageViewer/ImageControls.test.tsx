import { toast } from 'react-toastify'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { UploadImageArgs } from '@store/api/itemApiSlice'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { readFileToDataURL } from '~/utils'

import ImageControls from './ImageControls'

vi.mock('react-toastify', () => ({
    toast: { error: vi.fn() },
}))
vi.mock('~/utils', () => ({ readFileToDataURL: vi.fn() }))

function renderComponent(
    setPreviewImage: (image: string | null) => void,
    uploadImage: (args: UploadImageArgs) => Promise<void> = vi.fn()
) {
    return render(
        <ImageControls
            itemId={1}
            currentImage={0}
            setCurrentImage={vi.fn()}
            currentImages={[]}
            editModeToken="token"
            primaryImage={null}
            primaryImageIndex={() => null}
            onSetPrimaryImage={vi.fn()}
            onDeleteImage={vi.fn()}
            setPreviewImage={setPreviewImage}
            uploadImage={uploadImage}
            isUploadingImage={false}
        />
    )
}

function selectFile() {
    const file = new File(['data'], 'image.png', { type: 'image/png' })
    fireEvent.click(screen.getByTitle('Upload image...'))
    const input = document.getElementById(
        'qcext-image-upload'
    ) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
}

describe('ImageControls', () => {
    afterEach(() => {
        vi.mocked(toast.error).mockClear()
        vi.mocked(readFileToDataURL).mockReset()
    })

    it('surfaces an error toast when reading the selected file fails', async () => {
        const setPreviewImage = vi.fn()
        vi.mocked(readFileToDataURL).mockRejectedValue(
            new ProgressEvent('error')
        )

        renderComponent(setPreviewImage)
        selectFile()

        await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1))
        expect(setPreviewImage).not.toHaveBeenCalledWith(
            expect.any(ProgressEvent)
        )
    })

    it('previews the file once it has been read successfully', async () => {
        const setPreviewImage = vi.fn()
        vi.mocked(readFileToDataURL).mockResolvedValue('data:image/png;base64,')

        renderComponent(setPreviewImage)
        selectFile()

        await waitFor(() =>
            expect(setPreviewImage).toHaveBeenCalledWith(
                'data:image/png;base64,'
            )
        )
        expect(toast.error).not.toHaveBeenCalled()
    })

    it('closes the popup and clears the preview once the upload succeeds', async () => {
        const setPreviewImage = vi.fn()
        const uploadImage = vi.fn().mockResolvedValue(undefined)
        vi.mocked(readFileToDataURL).mockResolvedValue('data:image/png;base64,')

        renderComponent(setPreviewImage, uploadImage)
        selectFile()
        await waitFor(() =>
            expect(setPreviewImage).toHaveBeenCalledWith(
                'data:image/png;base64,'
            )
        )

        fireEvent.click(screen.getByText('Upload'))

        await waitFor(() => expect(uploadImage).toHaveBeenCalledTimes(1))
        await waitFor(() =>
            expect(setPreviewImage).toHaveBeenLastCalledWith(null)
        )
        expect(screen.queryByText('Upload')).not.toBeInTheDocument()
    })

    it('keeps the popup and selected file when the upload fails', async () => {
        const setPreviewImage = vi.fn()
        const uploadImage = vi.fn().mockRejectedValue(new Error('failed'))
        vi.mocked(readFileToDataURL).mockResolvedValue('data:image/png;base64,')

        renderComponent(setPreviewImage, uploadImage)
        selectFile()
        await waitFor(() =>
            expect(setPreviewImage).toHaveBeenCalledWith(
                'data:image/png;base64,'
            )
        )

        fireEvent.click(screen.getByText('Upload'))

        await waitFor(() => expect(uploadImage).toHaveBeenCalledTimes(1))
        expect(setPreviewImage).not.toHaveBeenLastCalledWith(null)
        expect(screen.getByText('Upload')).toBeInTheDocument()
    })
})
