import React, { ReactNode } from 'react';
import { Modal as AppModal, View, StyleSheet, ModalProps as AppModalProps } from 'react-native';

interface ModalProps extends AppModalProps {
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
    return (
        <AppModal transparent animationType="slide" {...props}>
            <View style={styles.container}>
                <View style={styles.modalView}>{children}</View>
            </View>
        </AppModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Modal;
