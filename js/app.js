class DemonListApp {
  constructor() {
    this.levels = [];
    this.players = [];
    this.storage = new DataStorage();
    this.searchManager = null;
    this.statsManager = null;
    this.historyManager = new HistoryManager();
    this.i18n = new I18nManager();
    
    this.currentSearchQuery = '';
    this.currentSortCriteria = 'position';
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.initializeManagers();
    this.setupEventListeners();
    this.setupLanguage();
    this.renderCurrentPage();
  }

  async loadData() {
    const storedLevels = this.storage.loadLevels();
    const storedPlayers = this.storage.loadPlayers();

    if (storedLevels && storedPlayers) {
      this.levels = storedLevels;
      this.players = storedPlayers;
    } else {
      this.levels = window.levelsData || [];
      this.players = window.playersData || [];
      
      this.storage.saveLevels(this.levels);
      this.storage.savePlayers(this.players);
    }
  }

  initializeManagers() {
    this.searchManager = new SearchManager(this.levels, this.players);
    this.statsManager = new StatisticsManager(this.levels, this.players);
  }

  setupEventListeners() {
    // Навигация
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link')) {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        this.navigateTo(page);
      }
      
      if (e.target.matches('.back-button')) {
        e.preventDefault();
        const page = e.target.getAttribute('data-page') || 'home';
        this.navigateTo(page);
      }
      
      if (e.target.matches('.level-card')) {
        const levelId = e.target.closest('.level-card').getAttribute('data-level-id');
        if (levelId) {
          this.navigateTo(`level/${levelId}`);
        }
      }
      
      if (e.target.matches('.player-card')) {
        const playerId = e.target.closest('.player-card').getAttribute('data-player-id');
        if (playerId) {
          this.navigateTo(`player/${playerId}`);
        }
      }
    });

    // Поиск
    document.addEventListener('input', (e) => {
      if (e.target.matches('.search-input')) {
        this.currentSearchQuery = e.target.value;
        this.renderCurrentPage();
      }
    });

    // Сортировка
    document.addEventListener('change', (e) => {
      if (e.target.matches('.sort-select')) {
        this.currentSortCriteria = e.target.value;
        this.renderCurrentPage();
      }
      
      if (e.target.matches('#language-selector')) {
        this.i18n.setLanguage(e.target.value);
        this.storage.saveSettings({ language: e.target.value });
        this.renderCurrentPage();
      }
    });

    window.addEventListener('hashchange', () => {
      this.renderCurrentPage();
    });
  }

  setupLanguage() {
    const settings = this.storage.loadSettings();
    const language = settings.language || 'en';
    this.i18n.setLanguage(language);
    
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = language;
    }
  }

  navigateTo(page) {
    window.location.hash = page;
  }

  getCurrentPage() {
    const hash = window.location.hash.substring(1);
    return hash || 'home';
  }

  renderCurrentPage() {
    const page = this.getCurrentPage();
    const app = document.getElementById('app');
    
    if (!app) return;

    app.classList.remove('fade-in');
    setTimeout(() => app.classList.add('fade-in'), 10);

    if (page.startsWith('level/')) {
      const levelId = parseInt(page.split('/')[1]);
      const level = this.levels.find(l => l.id === levelId);
      if (level) {
        app.innerHTML = DetailManager.renderLevelDetail(level);
      } else {
        this.renderHomePage();
      }
    } else if (page.startsWith('player/')) {
      const playerId = parseInt(page.split('/')[1]);
      const player = this.players.find(p => p.id === playerId);
      if (player) {
        app.innerHTML = DetailManager.renderPlayerDetail(player, this.levels);
      } else {
        this.renderHomePage();
      }
    } else {
      switch(page) {
        case 'home':
          this.renderHomePage();
          break;
        case 'levels':
          this.renderLevelsPage();
          break;
        case 'players':
          this.renderPlayersPage();
          break;
        case 'about':
          this.renderAboutPage();
          break;
        default:
          this.renderHomePage();
      }
    }

    this.i18n.updatePageContent();
  }

  renderHomePage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <section>
          <h2 class="section-title">Top Levels</h2>
          <div class="levels-grid">
            ${this.renderTopLevels(6)}
          </div>
        </section>
        
        <section>
          <h2 class="section-title">Top Players</h2>
          <div class="players-grid">
            ${this.renderTopPlayers(6)}
          </div>
        </section>
      </div>
    `;
  }

  renderLevelsPage() {
    const app = document.getElementById('app');
    let filteredLevels = this.levels;
    
    if (this.currentSearchQuery && this.searchManager) {
      filteredLevels = this.searchManager.searchLevels(this.currentSearchQuery);
    }
    
    if (this.currentSortCriteria) {
      filteredLevels = SortManager.sortLevels(filteredLevels, this.currentSortCriteria);
    }

    const sortOptions = SortManager.getSortOptions('levels')
      .map(option => `<option value="${option.value}">${this.i18n.t(option.label.toLowerCase())}</option>`)
      .join('');

    app.innerHTML = `
      <div class="container">
        <div class="controls">
          <input type="text" class="search-input" placeholder="${this.i18n.t('search')}" value="${this.currentSearchQuery}">
          <select class="sort-select">
            <option value="">${this.i18n.t('sort_by')}</option>
            ${sortOptions}
          </select>
        </div>
        
        <h2 class="section-title">${this.i18n.t('levels')}</h2>
        
        <div class="levels-grid">
          ${filteredLevels.map(level => this.renderLevelCard(level)).join('')}
        </div>
        
        ${filteredLevels.length === 0 ? `<p class="no-results">${this.i18n.t('no_levels_found')}</p>` : ''}
      </div>
    `;

    const sortSelect = app.querySelector('.sort-select');
    if (sortSelect) {
      sortSelect.value = this.currentSortCriteria;
    }
  }

  renderPlayersPage() {
    const app = document.getElementById('app');
    let filteredPlayers = this.players;
    
    if (this.currentSearchQuery && this.searchManager) {
      filteredPlayers = this.searchManager.searchPlayers(this.currentSearchQuery);
    }
    
    if (this.currentSortCriteria) {
      filteredPlayers = SortManager.sortPlayers(filteredPlayers, this.currentSortCriteria);
    }

    const sortOptions = SortManager.getSortOptions('players')
      .map(option => `<option value="${option.value}">${this.i18n.t(option.label.toLowerCase())}</option>`)
      .join('');

    app.innerHTML = `
      <div class="container">
        <div class="controls">
          <input type="text" class="search-input" placeholder="${this.i18n.t('search')}" value="${this.currentSearchQuery}">
          <select class="sort-select">
            <option value="">${this.i18n.t('sort_by')}</option>
            ${sortOptions}
          </select>
        </div>
        
        <h2 class="section-title">${this.i18n.t('players')}</h2>
        
        <div class="players-grid">
          ${filteredPlayers.map(player => this.renderPlayerCard(player)).join('')}
        </div>
        
        ${filteredPlayers.length === 0 ? `<p class="no-results">${this.i18n.t('no_players_found')}</p>` : ''}
      </div>
    `;

    const sortSelect = app.querySelector('.sort-select');
    if (sortSelect) {
      sortSelect.value = this.currentSortCriteria;
    }
  }

  renderAboutPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <h2 class="section-title">${this.i18n.t('about_title')}</h2>
        <div class="detail-container">
          <p>${this.i18n.t('about_content')}</p>
          
          <h3>${this.i18n.t('rules')}</h3>
          <ul>
            <li>${this.i18n.t('rule1')}</li>
            <li>${this.i18n.t('rule2')}</li>
            <li>${this.i18n.t('rule3')}</li>
          </ul>
          
          <h3>${this.i18n.t('contacts')}</h3>
          <p>${this.i18n.t('email')}</p>
        </div>
      </div>
    `;
  }

  renderLevelCard(level) {
    return `
      <div class="level-card" data-level-id="${level.id}">
        <div class="level-position">#${level.position}</div>
        <div class="level-name">${level.name}</div>
        <div class="level-creator">by ${level.creator}</div>
        <div class="level-points">${level.points.toLocaleString()} ${this.i18n.t('points')}</div>
      </div>
    `;
  }

  renderPlayerCard(player) {
    return `
      <div class="player-card" data-player-id="${player.id}">
        <div class="player-rank">#${player.rank}</div>
        <div class="player-name">${player.username}</div>
        <div class="player-country">${player.country}</div>
        <div class="player-points">${player.points.toLocaleString()} ${this.i18n.t('points')}</div>
      </div>
    `;
  }

  renderTopLevels(limit) {
    return this.levels
      .slice(0, limit)
      .map(level => this.renderLevelCard(level))
      .join('');
  }

  renderTopPlayers(limit) {
    return this.players
      .slice(0, limit)
      .map(player => this.renderPlayerCard(player))
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new DemonListApp();
});