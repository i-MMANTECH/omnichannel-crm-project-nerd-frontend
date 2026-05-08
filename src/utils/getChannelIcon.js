// Shared mapping from channel name to a local icon asset bundled under
// /public/assets. Local assets are preferred over remote URLs so the icons
// never fail to load due to a third-party outage, hotlink protection, or
// referer restriction.
//
// Accepts either a channel object (`{ name }` or `{ label }`) or a plain
// string. Returns the path to a local icon. Unknown channels fall back to
// the generic `/assets/channels.svg` so the UI never renders a broken image.

export const getChannelIcon = (channel) => {
    const raw =
        (typeof channel === "string" ? channel : channel?.name || channel?.label || "");
    const name = raw.toLowerCase();

    if (!name) return "/assets/channels.svg";

    if (name.includes("whatsapp")) return "/assets/whatsapp.png";
    if (name.includes("facebook")) return "/assets/Facebook.png";
    if (name.includes("instagram")) return "/assets/Instagram.png";
    if (name.includes("livechat") || name.includes("native")) return "/assets/livechat.svg";
    if (name.includes("email") || name.includes("mail")) return "/assets/email.svg";
    if (name.includes("sms")) return "/assets/sms.svg";

    return "/assets/channels.svg";
};
