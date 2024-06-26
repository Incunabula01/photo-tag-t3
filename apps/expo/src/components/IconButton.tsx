import { Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import React from 'react';

interface IconButtonProps {
    title?: string;
    onPress: () => void;
    icon: keyof typeof Entypo.glyphMap;
    iconColor?: string;
    iconSize?: number;
}

const IconButton = ({ title, onPress, icon, iconColor, iconSize }: IconButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} className='h-20 p-2 flex-row gap-2 items-center' >
            <Entypo name={icon} size={iconSize ? iconSize : 18} color={iconColor ? iconColor : "white"} />
            {title &&
                <Text className={`text-${iconColor ? `[${iconColor}]` : "white"} text-lg`}>{title}</Text>
            }

        </TouchableOpacity>
    )
}

export default IconButton;
