// insert all errorTranslation functions into this object here
errorTranslation = {
  insertOrUpdateGroup: require("./errorTranslation/insertOrUpdateGroup"),
  toggleGroupVisibility: require("./errorTranslation/toggleGroupVisibility"),
  toggleGroupTimerActive: require("./errorTranslation/toggleGroupTimerActive"),
  groupTimer: require("./errorTranslation/groupTimer"),
  joinGroup: require("./errorTranslation/joinGroup"),
  leaveGroup: require("./errorTranslation/leaveGroup"),
  deleteGroup: require("./errorTranslation/deleteGroup"),
  assignedGroup: require("./errorTranslation/assignedGroup"),
  currentCourses: require("./errorTranslation/currentCourses"),
  joinCourse: require("./errorTranslation/joinCourse"),
  leaveCourse: require("./errorTranslation/leaveCourse"),
  pdf: require("./errorTranslation/pdf")
};

module.exports = errorTranslation;
