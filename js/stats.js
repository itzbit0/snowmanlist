class StatisticsManager {
  constructor(levels, players) {
    this.levels = levels;
    this.players = players;
  }

  getGeneralStats() {
    const totalPoints = this.players.reduce((sum, player) => sum + player.points, 0);
    const averagePlayerPoints = totalPoints / this.players.length;
    const averageLevelPoints = this.levels.reduce((sum, level) => sum + level.points, 0) / this.levels.length;
    
    const mostActivePlayer = this.players.reduce((most, player) => 
      player.passedLevels.length > most.passedLevels.length ? player : most, this.players[0]
    );

    const countryStats = this.calculateCountryStats();

    return {
      totalLevels: this.levels.length,
      totalPlayers: this.players.length,
      totalPoints: Math.round(totalPoints),
      averagePlayerPoints: Math.round(averagePlayerPoints),
      averageLevelPoints: Math.round(averageLevelPoints),
      hardestLevel: this.levels[0],
      mostActivePlayer: mostActivePlayer,
      countryDistribution: countryStats
    };
  }

  calculateCountryStats() {
    const countryMap = {};
    this.players.forEach(player => {
      countryMap[player.country] = (countryMap[player.country] || 0) + 1;
    });
    
    return Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  getLevelStats() {
    const totalObjects = this.levels.reduce((sum, level) => sum + level.details.objects, 0);
    const averageObjects = totalObjects / this.levels.length;
    const totalLength = this.levels.reduce((sum, level) => sum + level.details.length, 0);
    const averageLength = totalLength / this.levels.length;

    const creators = [...new Set(this.levels.map(level => level.creator))];
    const mostCommonCreator = this.findMostCommonCreator();

    return {
      totalObjects: totalObjects,
      averageObjects: Math.round(averageObjects),
      totalLength: totalLength,
      averageLength: Math.round(averageLength),
      uniqueCreators: creators.length,
      mostCommonCreator: mostCommonCreator
    };
  }

  findMostCommonCreator() {
    const creatorCount = {};
    this.levels.forEach(level => {
      creatorCount[level.creator] = (creatorCount[level.creator] || 0) + 1;
    });
    
    return Object.entries(creatorCount)
      .sort((a, b) => b[1] - a[1])[0];
  }

  getPlayerStats() {
    const averageLevelsCompleted = this.players.reduce((sum, player) => 
      sum + player.passedLevels.length, 0) / this.players.length;

    const pointsDistribution = this.calculatePointsDistribution();

    return {
      averageLevelsCompleted: Math.round(averageLevelsCompleted),
      pointsDistribution: pointsDistribution
    };
  }

  calculatePointsDistribution() {
    const ranges = [
      { range: '0-5k', min: 0, max: 5000, count: 0 },
      { range: '5k-10k', min: 5000, max: 10000, count: 0 },
      { range: '10k-15k', min: 10000, max: 15000, count: 0 },
      { range: '15k+', min: 15000, max: Infinity, count: 0 }
    ];

    this.players.forEach(player => {
      const range = ranges.find(r => player.points >= r.min && player.points < r.max);
      if (range) range.count++;
    });

    return ranges;
  }

  renderStats() {
    const generalStats = this.getGeneralStats();
    const levelStats = this.getLevelStats();
    const playerStats = this.getPlayerStats();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${generalStats.totalLevels}</div>
          <div class="stat-label">Total Levels</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${generalStats.totalPlayers}</div>
          <div class="stat-label">Total Players</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${generalStats.totalPoints.toLocaleString()}</div>
          <div class="stat-label">Total Points</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${generalStats.averagePlayerPoints.toLocaleString()}</div>
          <div class="stat-label">Avg Player Points</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${levelStats.averageObjects.toLocaleString()}</div>
          <div class="stat-label">Avg Objects/Level</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${playerStats.averageLevelsCompleted}</div>
          <div class="stat-label">Avg Levels/Player</div>
        </div>
      </div>

      <div class="detail-container">
        <h3>Top Countries</h3>
        <div class="country-stats">
          ${generalStats.countryDistribution.slice(0, 5).map(country => `
            <div class="country-stat">
              <span class="country-name">${country.country}</span>
              <span class="country-count">${country.count} players</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="detail-container">
        <h3>Points Distribution</h3>
        <div class="points-distribution">
          ${playerStats.pointsDistribution.map(range => `
            <div class="distribution-item">
              <span class="distribution-range">${range.range}</span>
              <span class="distribution-count">${range.count} players</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}