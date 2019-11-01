// insert all errorTranslation functions into this object here
errorTranslation = {
  insertOrUpdateGroup: require("./errorTranslation/insertOrUpdateGroup"),
  toggleGroupVisibility: require("./errorTranslation/toggleGroupVisibility"),
  toggleGroupTimerActive: require("./errorTranslation/toggleGroupTimerActive"),
  groupTimer: require("./errorTranslation/groupTimer"),
  joinGroup: require("./errorTranslation/joinGroup"),
  deleteGroup: require("./errorTranslation/deleteGroup"),
};

module.exports = errorTranslation;
