class SortManager {
  static sortLevels(levels, criteria, ascending = false) {
    const sorted = [...levels];
    
    switch(criteria) {
      case 'position':
        sorted.sort((a, b) => a.position - b.position);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'creator':
        sorted.sort((a, b) => a.creator.localeCompare(b.creator));
        break;
      case 'points':
        sorted.sort((a, b) => b.points - a.points);
        break;
      case 'length':
        sorted.sort((a, b) => a.details.length - b.details.length);
        break;
      case 'objects':
        sorted.sort((a, b) => a.details.objects - b.details.objects);
        break;
      default:
        sorted.sort((a, b) => a.position - b.position);
    }
    
    return ascending ? sorted.reverse() : sorted;
  }

  static sortPlayers(players, criteria, ascending = false) {
    const sorted = [...players];
    
    switch(criteria) {
      case 'rank':
        sorted.sort((a, b) => a.rank - b.rank);
        break;
      case 'username':
        sorted.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'country':
        sorted.sort((a, b) => a.country.localeCompare(b.country));
        break;
      case 'points':
        sorted.sort((a, b) => b.points - a.points);
        break;
      case 'levelsCompleted':
        sorted.sort((a, b) => b.passedLevels.length - a.passedLevels.length);
        break;
      default:
        sorted.sort((a, b) => a.rank - b.rank);
    }
    
    return ascending ? sorted.reverse() : sorted;
  }

  static getSortOptions(type) {
    if (type === 'levels') {
      return [
        { value: 'position', label: 'Position' },
        { value: 'name', label: 'Name' },
        { value: 'creator', label: 'Creator' },
        { value: 'points', label: 'Points' },
        { value: 'length', label: 'Length' },
        { value: 'objects', label: 'Objects' }
      ];
    } else {
      return [
        { value: 'rank', label: 'Rank' },
        { value: 'username', label: 'Username' },
        { value: 'country', label: 'Country' },
        { value: 'points', label: 'Points' },
        { value: 'levelsCompleted', label: 'Levels Completed' }
      ];
    }
  }
}