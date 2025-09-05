import {
    Avatar,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea
} from "@heroui/react";
import { MdModeEditOutline } from "react-icons/md";

export default function UpdatePostModal({ image, body, setBody, updatePost, isOpen, handleUpdatePhotoPost, resetUpdateForm, isUpdatePending }) {

    return (
        <Modal placement="top" isOpen={isOpen} size={'md'} onClose={resetUpdateForm} >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{'Edit Post'}</ModalHeader>
                <ModalBody className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <Avatar
                            className={`w-60 md:w-100 h-60  rounded-2xl text-2xl text-center ${image ? 'bg-white' : 'bg-gray-400'}`}
                            classNames={{
                                img: "object-contain object-top",
                            }}
                            src={image instanceof File ? URL.createObjectURL(image) : image}
                            alt={`Selected Image `}
                            fallback="No image Selected"
                            color={image ? 'none' : ''}
                        />
                        <input
                            type="file"
                            className="hidden"
                            id='updatePost'
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleUpdatePhotoPost}
                        />
                        <label htmlFor="updatePost" className=' flex items-center justify-center'>
                            <span className={`absolute bg-white border-2 duration-250 group  shadow-lg text-secondary hover:bg-text-secondary hover:text-secondary  size-7 rounded-full flex-center bottom-2 right-2 cursor-pointer ${isUpdatePending ? 'animate-pulse pointer-events-none' : ''}`} >
                                <MdModeEditOutline className="group-hover:scale-120 duration-250" size={15} />
                            </span>
                        </label>
                    </div>
                    <p className="text-xs text-gray-400 ">Click on the edit icon to select a new image</p>
                    {
                        <div className="w-full">
                            <Textarea
                                className="w-full"
                                description="Enter a concise description of your post"
                                label="Description"
                                placeholder="Enter your description"
                                variant="bordered"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </div>
                    }
                </ModalBody>
                <ModalFooter className="flex ">
                    <Button className="w-full" color="danger" variant="flat" onPress={resetUpdateForm} isLoading={isUpdatePending}>
                        Cancel
                    </Button>
                    <Button className="w-full" color="primary" onPress={updatePost} isLoading={isUpdatePending}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
