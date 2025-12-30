class HistoryManager {
  constructor() {
    this.historyKey = 'demonList_history';
    this.maxHistoryItems = 50;
  }

  addEvent(type, data) {
    const history = this.getHistory();
    const event = {
      id: Date.now(),
      type: type,
      data: data,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    history.unshift(event);
    
    // Сохраняем только последние maxHistoryItems событий
    if (history.length > this.maxHistoryItems) {
      history.splice(this.maxHistoryItems);
    }

    this.saveHistory(history);
    return event;
  }

  getHistory() {
    const data = localStorage.getItem(this.historyKey);
    return data ? JSON.parse(data) : [];
  }

  saveHistory(history) {
    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  clearHistory() {
    localStorage.removeItem(this.historyKey);
  }

  addLevelPositionChange(level, oldPosition, newPosition, reason = 'Position change') {
    return this.addEvent('level_position_change', {
      levelId: level.id,
      levelName: level.name,
      oldPosition: oldPosition,
      newPosition: newPosition,
      reason: reason
    });
  }

  addPlayerRankChange(player, oldRank, newRank, reason = 'Rank change') {
    return this.addEvent('player_rank_change', {
      playerId: player.id,
      playerName: player.username,
      oldRank: oldRank,
      newRank: newRank,
      reason: reason
    });
  }

  addLevelVerification(level, verifiedBy) {
    return this.addEvent('level_verification', {
      levelId: level.id,
      levelName: level.name,
      verifiedBy: verifiedBy
    });
  }

  getRecentEvents(limit = 10) {
    const history = this.getHistory();
    return history.slice(0, limit);
  }

  getEventsByType(type, limit = 10) {
    const history = this.getHistory();
    return history
      .filter(event => event.type === type)
      .slice(0, limit);
  }

  renderRecentEvents(limit = 10) {
    const events = this.getRecentEvents(limit);
    
    if (events.length === 0) {
      return '<p>No recent activity.</p>';
    }

    return `
      <div class="history-list">
        ${events.map(event => this.renderEvent(event)).join('')}
      </div>
    `;
  }

  renderEvent(event) {
    let content = '';
    
    switch(event.type) {
      case 'level_position_change':
        content = `
          <strong>${event.data.levelName}</strong> moved from 
          position #${event.data.oldPosition} to #${event.data.newPosition}
          ${event.data.reason ? `- ${event.data.reason}` : ''}
        `;
        break;
      case 'player_rank_change':
        content = `
          <strong>${event.data.playerName}</strong> changed rank from 
          #${event.data.oldRank} to #${event.data.newRank}
          ${event.data.reason ? `- ${event.data.reason}` : ''}
        `;
        break;
      case 'level_verification':
        content = `
          <strong>${event.data.levelName}</strong> was verified by ${event.data.verifiedBy}
        `;
        break;
      default:
        content = `Unknown event: ${event.type}`;
    }

    return `
      <div class="history-item">
        <div class="history-date">${event.date}</div>
        <div class="history-change">${content}</div>
      </div>
    `;
  }
}