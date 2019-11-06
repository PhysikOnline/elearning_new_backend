// insert all errorTranslation functions into this object here
errorTranslation = {
  insertOrUpdateGroup: require("./errorTranslation/insertOrUpdateGroup"),
  toggleGroupVisibility: require("./errorTranslation/toggleGroupVisibility"),
  toggleGroupTimerActive: require("./errorTranslation/toggleGroupTimerActive"),
  groupTimer: require("./errorTranslation/groupTimer"),
  joinGroup: require("./errorTranslation/joinGroup"),
  leaveGroup: require("./errorTranslation/leaveGroup"),
  deleteGroup: require("./errorTranslation/deleteGroup"),
  joinCourse: require("./errorTranslation/joinCourse"),
  leaveCourse: require("./errorTranslation/leaveCourse")
};

module.exports = errorTranslation;
