import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"

const DialogWidget = ({child = null, title = '', children, open, setOpen, ...props}) => {
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} {...props}>
      {child && (<Dialog.Trigger asChild>
        {child}
      </Dialog.Trigger>)}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
           <Dialog.Header>
                <CloseButton size="sm" onClick={() => setOpen(false)}/>
                {title &&<Dialog.Title>{title}</Dialog.Title>}
            </Dialog.Header>
            <Dialog.Body>
             {children}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default DialogWidget;