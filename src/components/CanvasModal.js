import React, {useState} from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Label, Input } from 'reactstrap';

const CanvasModal = (props) => {

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const width = e.target.width.value
        const height = e.target.height.value
        const fps = e.target.fps.value

        props.newCanvas(width, height, fps)
        toggle()
    } 

    return (
        <div>
            <Button onClick={toggle} className="btn mb-2">New</Button>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>New Canvas</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Label for="width">Width</Label>
                        <Input className="mb-2" type="number" name="width" id="width" defaultValue="16" onClick={(e)=>e.target.focus()} />
                        <Label for="height">Height</Label>
                        <Input className="mb-2" type="number" name="height" id="height" defaultValue="16" onClick={(e)=>e.target.focus()} />
                        <Label for="fps">FPS</Label>
                        <Input className="mb-2" type="number" name="fps" id="fps" defaultValue="12" onClick={(e)=>e.target.focus()} />
                        <Button className="btn">Create</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default CanvasModal
