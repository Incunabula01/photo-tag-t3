"use client";

import React, { ReactNode } from 'react';
import { Modal as AppModal, View, StyleSheet } from 'react-native';
import { useModalStore } from '../store/GlobalStore';


export const ModalProvider = ({ children }: { children: ReactNode | null }) => {
    const { isOpen, modalWrapper, component, closeModal } = useModalStore();

    return (
        <>
            {children}
            <AppModal visible={isOpen} animationType="fade" transparent onRequestClose={closeModal}>
                {modalWrapper ?
                    <View style={styles.container}>
                        <View style={styles.modalView}>
                            {component}
                        </View>
                    </View> :
                    <>
                        {component}
                    </>
                }
            </AppModal>
        </>
    );
};

export const useModal = () => useModalStore();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
