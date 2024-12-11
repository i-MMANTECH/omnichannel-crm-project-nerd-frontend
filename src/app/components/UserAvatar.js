import React from 'react';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const getInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
    return initials;
};

const UserAvatar = ({ name, width='w-10', height='h-10' }) => {
    const initials = getInitials(name);
    const randomColor = getRandomColor(); // Generate a random background color

    return (
        <div
            className={`${width} ${height} rounded-full flex items-center justify-center text-white font-bold text-lg`}
            style={{ backgroundColor: randomColor }}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
