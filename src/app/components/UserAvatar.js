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
    
    const firstLetter = nameParts[0].charAt(0).toUpperCase();
    
    let secondLetter = '';
    if (nameParts[1] && nameParts[1].length >= 2) {
        // If there's a second name, use its second letter (uppercase)
        secondLetter = nameParts[1].charAt(0).toUpperCase();
    } else {
        // If no second name or second name is too short, use second letter of first name (lowercase)
        secondLetter = nameParts[0].charAt(1)?.toLowerCase() || '-';
    }
    
    return firstLetter + secondLetter;
};

const UserAvatar = ({ 
    name, 
    width='w-10', 
    height='h-10', 
    className,
    color // New prop for custom color
}) => {
    const initials = getInitials(name);
    
    const backgroundColor = useMemo(() => {
        return color || getRandomColor(name);
    }, [name, color]);

    return (
        <div
            className={`p-4 ${width} ${height} ${className}  rounded-full flex items-center justify-center text-white font-bold text-lg`}
            style={{ backgroundColor }}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
