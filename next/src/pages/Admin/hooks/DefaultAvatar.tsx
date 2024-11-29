import React from 'react';

interface DefaultAvatarProps {
    name: string;
    size?: number;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ name, size = 100 }) => {
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: '#6a00ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: size / 3,
                fontWeight: 'bold'
            }}
        >
            {initials}
        </div>
    );
};

export default DefaultAvatar; 