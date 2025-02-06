import React, { useMemo } from 'react';

const getRandomColor = (seed) => {
    // Use the name as a seed to generate consistent colors for the same name
    let hash = 0;
    for (let i = 0; i < seed?.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
        '#E67E22', '#1ABC9C', '#34495E', '#7F8C8D'
    ];
    
    // Use the hash to select a color from the predefined array
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const getInitials = (name) => {
    if (!name) return '--';
    const nameParts = name.split(' ');
    const initials = nameParts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    return initials;
};

const UserAvatar = ({ 
    name, 
    width='w-10', 
    height='h-10', 
    className,
    color // New prop for custom color
}) => {
    const initials = getInitials(name);
    
    // Use useMemo to maintain consistent color for the same name
    const backgroundColor = useMemo(() => {
        return color || getRandomColor(name);
    }, [name, color]);

    return (
        <div
            className={`${width} ${height} ${className} rounded-full flex items-center justify-center text-white font-bold text-lg`}
            style={{ backgroundColor }}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
