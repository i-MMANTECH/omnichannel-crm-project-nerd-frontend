export const getRoleStyle = (role) => {
    switch (role) {
      case "User":
        return { backgroundColor: "#F4F0FF", color: "#936DFF" };
      case "Admin":
        return { backgroundColor: "#FEF1ED", color: "#F36F4A" };
      default:
        return {};
    }
  };