import {
    Avatar,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@heroui/react";
import { MdModeEditOutline } from "react-icons/md";
import useUpdate from "../../Hooks/useUpdate";
import { ValidationImage } from "../../utils/ValidationImage";
import { useState } from "react";

export default function ProfilePhotoModal({ isOpen, userInfo, onClose }) {
    const [image, setImage] = useState(null)
    // validate the image 
    const handleChangeProfilePicture = (e) => {
        let file = e.target.files[0];
        if (ValidationImage(e)) {
            setImage(file)
        }
        else {
            setImage(null)
        }
    }

    // reset the image field
    const resetImage = () => {
        setImage(null)
        onClose()
    }
    // upload Profile Picture of user
    const { mutate: uploadProfilePicture, isPending: isUploading } = useUpdate('uploadProfilePicture', image, resetImage)
    return (
        <Modal placement="top" isOpen={isOpen} size={'md'} onClose={resetImage}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1"> Change Profile Picture</ModalHeader>
                <ModalBody className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <Avatar
                            isBordered
                            radius="full"
                            className={'size-42'}
                            classNames={{
                                img: "object-cover object-top",
                            }}
                            src={image instanceof File ? URL.createObjectURL(image) : userInfo?.user?.photo}
                            alt={userInfo?.user?.name || 'No Image Selected'}
                            color={'primary'}
                            fallback="No image Selected"
                        />

                        <input
                            type="file"
                            className="hidden"
                            id='upload'
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleChangeProfilePicture}
                        />
                        <label htmlFor="upload" className=' flex items-center justify-center'>
                            <span className={`absolute bg-white border-2 duration-250 group  shadow-lg text-primary hover:bg-primary hover:text-white size-7 rounded-full flex-center bottom-2 right-2 cursor-pointer ${isUploading ? 'animate-pulse pointer-events-none' : ''}`} >
                                <MdModeEditOutline className="group-hover:scale-120 duration-250" size={15} />
                            </span>
                        </label>
                    </div>
                </ModalBody>
                <ModalFooter className="flex ">
                    <Button className="w-full" color="danger" variant="flat" onPress={resetImage} isLoading={isUploading}>
                        Cancel
                    </Button>
                    <Button className="w-full" color="primary" onPress={uploadProfilePicture} isLoading={isUploading}>
                        Change Picture
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
