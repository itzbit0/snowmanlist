class DataStorage {
  constructor() {
    this.levelsKey = 'demonList_levels';
    this.playersKey = 'demonList_players';
    this.settingsKey = 'demonList_settings';
  }

  saveLevels(levels) {
    if (this.validateLevels(levels)) {
      localStorage.setItem(this.levelsKey, JSON.stringify(levels));
      return true;
    }
    return false;
  }

  savePlayers(players) {
    if (this.validatePlayers(players)) {
      localStorage.setItem(this.playersKey, JSON.stringify(players));
      return true;
    }
    return false;
  }

  loadLevels() {
    const data = localStorage.getItem(this.levelsKey);
    return data ? JSON.parse(data) : null;
  }

  loadPlayers() {
    const data = localStorage.getItem(this.playersKey);
    return data ? JSON.parse(data) : null;
  }

  saveSettings(settings) {
    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
  }

  loadSettings() {
    const data = localStorage.getItem(this.settingsKey);
    return data ? JSON.parse(data) : { language: 'en' };
  }

  validateLevels(levels) {
    if (!Array.isArray(levels)) return false;
    return levels.every(level => this.validateLevel(level));
  }

  validateLevel(level) {
    const required = ['id', 'name', 'creator', 'position', 'points'];
    return required.every(field => level.hasOwnProperty(field));
  }

  validatePlayers(players) {
    if (!Array.isArray(players)) return false;
    return players.every(player => this.validatePlayer(player));
  }

  validatePlayer(player) {
    const required = ['id', 'username', 'country', 'points', 'rank'];
    return required.every(field => player.hasOwnProperty(field));
  }

  clearAll() {
    localStorage.removeItem(this.levelsKey);
    localStorage.removeItem(this.playersKey);
    localStorage.removeItem(this.settingsKey);
  }
}