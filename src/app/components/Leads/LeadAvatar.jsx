"use client";

import React, { useState } from "react";
import UserAvatar from "../UserAvatar";

// Renders a lead's profile image when one is available and falls back to the
// initials-based UserAvatar if the image fails to load (broken URL, expired
// CDN token, blocked referer, etc.). Empty alt keeps the broken-image fallback
// from rendering alt text inside the 32x32 box, which is what produces the
// "pri" / "Channel Icon" stacked-letter glyphs we've seen elsewhere.

const LeadAvatar = ({ image, name, widthClass = "w-8", heightClass = "h-8" }) => {
    const [failed, setFailed] = useState(false);

    if (!image || failed) {
        return <UserAvatar name={name} width={widthClass} height={heightClass} />;
    }

    return (
        <img
            src={image}
            alt=""
            className={`${widthClass} ${heightClass} rounded-full object-cover`}
            onError={() => setFailed(true)}
        />
    );
};

export default LeadAvatar;
