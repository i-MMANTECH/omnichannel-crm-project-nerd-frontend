import { usePermissions } from "@/context/PermissionsContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ requiredPermission, children }) => {
  const router = useRouter();
  const { checkPermission } = usePermissions();

  const hasPermission = checkPermission(requiredPermission);

  useEffect(() => {
    if (!hasPermission) {
      router.push("/unauthorized");
    }
  }, [hasPermission, router]);

  if (hasPermission === null) {
    return <div>Loading...</div>;
  }

  if (!hasPermission) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
