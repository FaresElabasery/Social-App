import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@heroui/react";
export default function ConfirmModal({ deletePost, isConfirmOpen, onConfirmOpenChange }) {
    return (
        <>
            <Modal placement="top-center" isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col ">Delete Post</ModalHeader>
                            <ModalBody className="text-sm text-gray-600">
                                Are you sure you want to delete this post?
                            </ModalBody>
                            <ModalFooter className="flex items-center justify-between">
                                <Button fullWidth color="primary" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button fullWidth color="danger" onPress={() => { deletePost(); onClose() }}>
                                    Delete the Post
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}
