class View {
  constructor() {
    this.app = document.getElementById('app')

    this.searchLine = this.createElement('div', 'search-line');
    this.searchInput = this.createElement('input', 'search-input');
    this.searchOption = this.createElement('ul', 'search-option')
    this.searchLine.append(this.searchInput, this.searchOption); 

    this.repWrapper = this.createElement('div', 'rep-wrapper')
    this.repsList = this.createElement('ul', 'reps')
    this.repWrapper.append(this.repsList)

    this.main = this.createElement('div', 'main')
    this.main.append(this.repWrapper)

    this.app.append(this.searchLine)
    this.app.append(this.main)
  }
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element
  }

  clear() {
    this.searchOption.innerHTML = '';
  }

  createRep(repData) {
    const repElement = this.createElement('ul', `rep-prev`);
    repElement.innerHTML =   `<div class ='rep-prev-wrapper'><li class ='rep-prev-name'> Name: ${repData.name} </li>
                             <li class ='rep-prev-owner'> Owner: ${repData.owner.login} </li>
                             <li class ='rep-prev-stars'> Stars: ${repData.stargazers_count} </li></div>
                             <button class ='btn-close btn-close${repData.name}'> <img src = 'img/Frame.svg'> </button>`                  
    this.main.append(repElement)

    const btnClose = document.querySelector(`.btn-close${repData.name}`);
    btnClose.addEventListener('click', function() {
      repElement.remove()
    })
    this.clear()
  }



  createOptoin(repOption) {
    const repElement = this.createElement('li', 'rep-option');
    repElement.addEventListener('click', () => {this.createRep(repOption)})
    repElement.innerHTML = `<p class ='rep-option-name'> ${repOption.name} </p>`
    this.searchOption.append(repElement)
    
  }
  
}

let repOpt = document.querySelector('.rep-option')
const REP_PER_PAGE = 5

class Search {
  constructor(View, Api) {
    this.View = View
    this.Api = Api

    this.View.searchInput.addEventListener('keyup', this.debounce(this.searchReps.bind(this), 500))

    
  }

  searchReps() {
    const searchValue = this.View.searchInput.value 
    if(searchValue) {
      this.clearReps()
      this.respRequest(searchValue)
    } else {
      this.clearReps()
    }

  }

  clearReps() {
    this.View.searchOption.innerHTML = '';
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  respRequest(searchValue) {
    this.Api.loadReps(searchValue)
    .then((res) => {
      if(res.ok) {
        res.json().then(res => {
          res.items.forEach(rep => {
            this.View.createOptoin(rep)
          });
        })
      }
    })    
  }

};

const URL = 'https://api.github.com/';

class Api {
  constructor() {

  }
  async loadReps(value) {
    return await fetch(`${URL}search/repositories?q=${value}&per_page=5`)
  }

}

new Search(new View(Search), new Api); 