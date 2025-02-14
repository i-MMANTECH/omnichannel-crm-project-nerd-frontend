import { usePermissions } from "@/context/PermissionsContext";

const checkPermission = (permission) => {
  let permissions = JSON.parse(localStorage.getItem('permissions')) || [];

  if (!permissions.length) {
    permissions = usePermissions();
  }

  return permissions.some(perm => perm.codename === permission);
};

export default checkPermission;
