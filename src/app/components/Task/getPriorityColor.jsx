const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"; // red for high priority
      case "medium":
        return "bg-yellow-500"; // yellow for medium priority
      case "low":
        return "bg-green-500"; // green for low priority
      default:
        return "bg-gray-500"; // default color
    }
  };
  
  export default getPriorityColor;
  