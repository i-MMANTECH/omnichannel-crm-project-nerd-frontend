const ROLES = {
    admin: [
      "view:tasks", "create:tasks", "update:tasks", "delete:tasks",
      "view:leads", "create:leads", "update:leads", "delete:leads"
    ],
    task_manager: [
      "view:tasks", "create:tasks", "update:tasks", "delete:tasks"
    ],
    lead_manager: [
      "view:leads", "create:leads", "update:leads", "delete:leads"
    ],
    user: [
      "view:tasks", "view:leads"
    ],
  };
  
  export function hasPermission(user, permission) {
    return ROLES[user.role]?.includes(permission);
  }
  