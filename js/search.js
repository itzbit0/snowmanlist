class SearchManager {
  constructor(levels, players) {
    this.levels = levels;
    this.players = players;
  }

  searchLevels(query) {
    if (!query.trim()) return this.levels;
    
    const searchTerm = query.toLowerCase();
    return this.levels.filter(level => 
      level.name.toLowerCase().includes(searchTerm) ||
      level.creator.toLowerCase().includes(searchTerm) ||
      level.details.description.toLowerCase().includes(searchTerm)
    );
  }

  searchPlayers(query) {
    if (!query.trim()) return this.players;
    
    const searchTerm = query.toLowerCase();
    return this.players.filter(player => 
      player.username.toLowerCase().includes(searchTerm) ||
      player.country.toLowerCase().includes(searchTerm)
    );
  }

  filterLevelsByCreator(creator) {
    return this.levels.filter(level => 
      level.creator.toLowerCase() === creator.toLowerCase()
    );
  }

  filterPlayersByCountry(country) {
    return this.players.filter(player => 
      player.country.toLowerCase() === country.toLowerCase()
    );
  }

  getUniqueCreators() {
    return [...new Set(this.levels.map(level => level.creator))];
  }

  getUniqueCountries() {
    return [...new Set(this.players.map(player => player.country))];
  }
}