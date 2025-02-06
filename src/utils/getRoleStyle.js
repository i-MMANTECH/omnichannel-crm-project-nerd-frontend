export const getRoleStyle = (role) => {
  const roleColors = {
    "Admin": { backgroundColor: "#FEF1ED", color: "#F36F4A" },
    "User": { backgroundColor: "#F4F0FF", color: "#936DFF" },
    "Tester": { backgroundColor: "#E3FCEF", color: "#1F9254" },
    "Manager": { backgroundColor: "#FFF4E5", color: "#FF8C00" },
  };

  if (roleColors[role]) return roleColors[role];

  const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return { backgroundColor: `hsl(${hue}, 80%, 90%)`, color: `hsl(${hue}, 70%, 40%)` };
  };

  return generateColorFromName(role);
};
