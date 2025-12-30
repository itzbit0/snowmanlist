class I18nManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Navigation
        'home': 'Home',
        'levels': 'Levels',
        'players': 'Players',
        'about': 'About',
        
        // Common
        'search': 'Search...',
        'sort_by': 'Sort by',
        'position': 'Position',
        'name': 'Name',
        'creator': 'Creator',
        'points': 'Points',
        'length': 'Length',
        'objects': 'Objects',
        'rank': 'Rank',
        'username': 'Username',
        'country': 'Country',
        'levels_completed': 'Levels Completed',
        
        // Stats
        'total_levels': 'Total Levels',
        'total_players': 'Total Players',
        'total_points': 'Total Points',
        'avg_player_points': 'Avg Player Points',
        'avg_objects_level': 'Avg Objects/Level',
        'avg_levels_player': 'Avg Levels/Player',
        'top_countries': 'Top Countries',
        'points_distribution': 'Points Distribution',
        
        // Details
        'back_to_levels': '← Back to Levels',
        'back_to_players': '← Back to Players',
        'description': 'Description',
        'music': 'Music',
        'verification': 'Verification',
        'verified_by': 'Verified by',
        'on': 'on',
        'videos': 'Videos',
        'position_history': 'Position History',
        'completed_levels': 'Completed Levels',
        'no_levels_completed': 'No levels completed yet',
        'hardest_level': 'Hardest Level',
        'avg_points': 'Avg Points',
        
        // About
        'about_title': 'About Demon List',
        'about_content': 'This is a community-maintained demon list for Geometry Dash levels.',
        'rules': 'Rules',
        'rule1': 'Only extreme demons are listed',
        'rule2': 'Verification video required',
        'rule3': 'Points based on level position',
        'contacts': 'Contacts',
        'email': 'Email: admin@demondlist.com',
        
        // Home
        'top_levels': 'Top Levels',
        'top_players': 'Top Players',
        
        // Messages
        'no_levels_found': 'No levels found matching your search.',
        'no_players_found': 'No players found matching your search.'
      },
      ru: {
        // Navigation
        'home': 'Главная',
        'levels': 'Уровни',
        'players': 'Игроки',
        'about': 'О сайте',
        
        // Common
        'search': 'Поиск...',
        'sort_by': 'Сортировать по',
        'position': 'Позиция',
        'name': 'Название',
        'creator': 'Создатель',
        'points': 'Очки',
        'length': 'Длина',
        'objects': 'Объекты',
        'rank': 'Ранг',
        'username': 'Имя игрока',
        'country': 'Страна',
        'levels_completed': 'Пройдено уровней',
        
        // Stats
        'total_levels': 'Всего уровней',
        'total_players': 'Всего игроков',
        'total_points': 'Всего очков',
        'avg_player_points': 'Ср. очки игрока',
        'avg_objects_level': 'Ср. объектов/уровень',
        'avg_levels_player': 'Ср. уровней/игрок',
        'top_countries': 'Топ стран',
        'points_distribution': 'Распределение очков',
        
        // Details
        'back_to_levels': '← Назад к уровням',
        'back_to_players': '← Назад к игрокам',
        'description': 'Описание',
        'music': 'Музыка',
        'verification': 'Верификация',
        'verified_by': 'Верифицирован',
        'on': '',
        'videos': 'Видео',
        'position_history': 'История позиций',
        'completed_levels': 'Пройденные уровни',
        'no_levels_completed': 'Уровни еще не пройдены',
        'hardest_level': 'Сложнейший уровень',
        'avg_points': 'Ср. очки',
        
        // About
        'about_title': 'О Демон Листе',
        'about_content': 'Это демон-лист для уровней Geometry Dash, поддерживаемый сообществом.',
        'rules': 'Правила',
        'rule1': 'Только экстрим демоны в списке',
        'rule2': 'Требуется видео верификации',
        'rule3': 'Очки основаны на позиции уровня',
        'contacts': 'Контакты',
        'email': 'Email: admin@demondlist.com',
        
        // Home
        'top_levels': 'Топ Уровней',
        'top_players': 'Топ Игроков',
        
        // Messages
        'no_levels_found': 'Уровни, соответствующие запросу, не найдены.',
        'no_players_found': 'Игроки, соответствующие запросу, не найдены.'
      }
    };
  }

  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      return true;
    }
    return false;
  }

  t(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  updatePageContent() {
    // Обновляем навигацию
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    // Обновляем placeholder'ы
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Обновляем опции сортировки
    const sortSelects = document.querySelectorAll('.sort-select');
    sortSelects.forEach(select => {
      const currentValue = select.value;
      const options = Array.from(select.options);
      
      options.forEach(option => {
        const key = option.getAttribute('data-i18n-value');
        if (key) {
          option.textContent = this.t(key);
        }
      });
      
      select.value = currentValue;
    });
  }
}