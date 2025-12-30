class DetailManager {
  static renderLevelDetail(level) {
    return `
      <div class="container fade-in">
        <button class="back-button" data-page="levels">← ${window.app.i18n.t('back_to_levels')}</button>
        
        <div class="detail-container">
          <div class="detail-header">
            <h1 class="detail-title">${level.name}</h1>
            <div class="detail-subtitle">by ${level.creator}</div>
            <div class="level-position">${window.app.i18n.t('position')}: #${level.position}</div>
            <div class="level-points">${level.points.toLocaleString()} ${window.app.i18n.t('points')}</div>
          </div>

          <div class="detail-stats">
            <div class="detail-stat">
              <div class="detail-stat-value">${level.details.length}s</div>
              <div class="detail-stat-label">${window.app.i18n.t('length')}</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">${level.details.objects.toLocaleString()}</div>
              <div class="detail-stat-label">${window.app.i18n.t('objects')}</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">${level.details.version}</div>
              <div class="detail-stat-label">Version</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">${level.details.password}</div>
              <div class="detail-stat-label">Password</div>
            </div>
          </div>

          <div class="detail-content">
            <h3>${window.app.i18n.t('description')}</h3>
            <p>${level.details.description}</p>
            
            <h3>${window.app.i18n.t('music')}</h3>
            <p>${level.details.music}</p>
            
            ${level.verification ? `
              <h3>${window.app.i18n.t('verification')}</h3>
              <p>${window.app.i18n.t('verified_by')} ${level.verification.verifiedBy} ${window.app.i18n.t('on')} ${level.verification.verifiedAt}</p>
            ` : ''}
            
            ${level.youtubeLinks && level.youtubeLinks.length > 0 ? `
              <h3>${window.app.i18n.t('videos')}</h3>
              <div class="video-links">
                ${level.youtubeLinks.map(link => `
                  <a href="${link.url}" target="_blank" class="video-link">${link.title}</a>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        ${level.positionHistory && level.positionHistory.length > 0 ? `
          <div class="history-list">
            <h3>${window.app.i18n.t('position_history')}</h3>
            ${level.positionHistory.map(history => `
              <div class="history-item">
                <div class="history-date">${history.date}</div>
                <div class="history-change">${window.app.i18n.t('position')} #${history.position} - ${history.reason}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  static renderPlayerDetail(player, levels) {
    const passedLevels = (player.passedLevels || []).map(levelId => 
      levels.find(level => level.id === levelId)
    ).filter(level => level);

    const hardestCompleted = passedLevels.reduce((hardest, level) => 
      !hardest || level.position < hardest.position ? level : hardest, null
    );

    return `
      <div class="container fade-in">
        <button class="back-button" data-page="players">← ${window.app.i18n.t('back_to_players')}</button>
        
        <div class="detail-container">
          <div class="detail-header">
            <h1 class="detail-title">${player.username}</h1>
            <div class="detail-subtitle">${player.country}</div>
            <div class="player-rank">${window.app.i18n.t('rank')}: #${player.rank}</div>
            <div class="player-points">${player.points.toLocaleString()} ${window.app.i18n.t('points')}</div>
          </div>

          <div class="detail-stats">
            <div class="detail-stat">
              <div class="detail-stat-value">${player.stats?.totalLevels || 0}</div>
              <div class="detail-stat-label">Total Levels</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">${passedLevels.length}</div>
              <div class="detail-stat-label">${window.app.i18n.t('levels_completed')}</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">${hardestCompleted ? `#${hardestCompleted.position}` : 'N/A'}</div>
              <div class="detail-stat-label">${window.app.i18n.t('hardest_level')}</div>
            </div>
            <div class="detail-stat">
              <div class="detail-stat-value">${Math.round((player.stats?.averagePoints || 0)).toLocaleString()}</div>
              <div class="detail-stat-label">${window.app.i18n.t('avg_points')}</div>
            </div>
          </div>

          <div class="detail-content">
            <h3>${window.app.i18n.t('completed_levels')}</h3>
            ${passedLevels.length > 0 ? `
              <div class="levels-grid">
                ${passedLevels.map(level => `
                  <div class="level-card" data-level-id="${level.id}">
                    <div class="level-position">#${level.position}</div>
                    <div class="level-name">${level.name}</div>
                    <div class="level-creator">by ${level.creator}</div>
                    <div class="level-points">${level.points.toLocaleString()} ${window.app.i18n.t('points')}</div>
                  </div>
                `).join('')}
              </div>
            ` : `<p>${window.app.i18n.t('no_levels_completed')}</p>`}
          </div>
        </div>
      </div>
    `;
  }
}