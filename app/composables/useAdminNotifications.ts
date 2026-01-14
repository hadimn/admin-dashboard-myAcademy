export const useAdminNotifications = () => {
  const toast = useToast();

  const userCreated = (user: any) => {
    toast.add({
      title: "New User Registered",
      description: `${user.name} (${user.email})`,
      icon: "i-heroicons-user-plus",
      color: "success",
    });
  };

  const userDoneLesson = (userProgress: any) => {
    toast.add({
      title: `${userProgress.name} has completed a lesson!`,
      description: `User ${userProgress.name} has just completed lesson '${userProgress.lesson_title}' in course '${userProgress.course_title}'.`,
      icon: "i-heroicons-academic-cap",
      color: "success",
    });
  };

  return { userCreated, userDoneLesson };
};
