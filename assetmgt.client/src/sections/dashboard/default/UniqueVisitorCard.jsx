import { Box, Modal, Fade, Backdrop } from '@mui/material';

export default function UniqueVisitorCard({ open, onClose, children }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {children}   {/* <-- your AssetForm goes here */}
                </Box>
            </Fade>
        </Modal>
    );
}
