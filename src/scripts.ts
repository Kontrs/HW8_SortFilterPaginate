import axios from 'axios';

type Countries = {
    name: string,
    capital: string,
    currency: {
        name: string,
        symbol: string
    },
    language: {
        name: string
    }
}

class Country {
  countryTable: HTMLElement | null;
  limit = 20;
  scrollPosition = 0;
  sortOrder = 'asc';
  sortColumn = 'name';
  searchFor = '';

  constructor() {
    this.countryTable = document.querySelector<HTMLElement>('.js-table-body');
  }

  getData() {
    console.log('Fetching data with searchFor:', this.searchFor);
    return axios.get<Countries[]>(`http://localhost:3004/countries?_limit=${this.limit}&_sort=${this.sortColumn}&_order=${this.sortOrder}&${this.searchFor}`)
      .then(({ data }) => data);
  }

  drawTable(countries: Countries[]) {
    this.countryTable.innerHTML = '';
    countries.forEach((country, index) => {
      this.countryTable.innerHTML += `
        <tr data-index='${index}'>
            <th class='js-table-position'>${index + 1}</th>
              <td>${country.name}</td>
              <td>${country.capital || '-'}</td>
              <td>${country.currency.name} ${country.currency.symbol || ''}</td>
              <td>${country.language.name}</td>
            </tr>
        `;
    });
  }

  updateSort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
  }

  updateLimit() {
    this.limit += 20;
  }

  updateSearchConditions(searchFields: HTMLInputElement[]) {
    const searchConditions: string[] = [];
    searchFields.forEach((input) => {
      const inputValue = input.value.trim();
      const fieldName = input.getAttribute('data-column');
      if (inputValue !== '') {
        searchConditions.push(`${fieldName}_like=${inputValue}`);
      }
    });
    this.searchFor = searchConditions.join('&');
    console.log('Updated searchFor:', this.searchFor);
  }

  init() {
    this.getData().then((data) => {
      this.drawTable(data);
    });

    document.querySelector<HTMLButtonElement>('.js-search-button').addEventListener('click', () => {
      const searchFields = document.querySelectorAll<HTMLInputElement>('.input__box');
      this.updateSearchConditions([...searchFields]);
      this.getData().then((data: Countries[]) => {
        this.drawTable(data);
      });
    });

    document.querySelector('.js-load-more').addEventListener('click', () => {
      this.updateLimit();
      this.getData().then((data: Countries[]) => {
        this.drawTable(data);
      });
    });

    document.querySelectorAll('.js-sort').forEach((button) => {
      button.addEventListener('click', () => {
        const column = button.getAttribute('data-column');
        this.updateSort(column);
        this.getData().then((data: Countries[]) => {
          this.drawTable(data);
        });
      });
    });
  }
}

const countryManager = new Country();
countryManager.init();

// const countryTable = document.querySelector<HTMLElement>('.js-table-body');
// let limit = 20;
// let scrollPosition = 0;
// let sortOrder = 'asc';
// let sortColumn = 'name';
// const loadMore = document.querySelector('.js-load-more');
// const searchButton = document.querySelector<HTMLButtonElement>('.js-search-button');
// const searchFields = document.querySelectorAll<HTMLInputElement>('.input__box');
// let searchFor = '';

// const drawTable = () => {
//   axios.get<Country[]>(`http://localhost:3004/countries?_limit=${limit}&_sort=${sortColumn}&_order=${sortOrder}&${searchFor}`).then(({ data }) => {
//     scrollPosition = window.scrollY;
//     countryTable.innerHTML = '';
//     data.forEach((country, index) => {
//       countryTable.innerHTML += `
//             <tr data-index='${index}'>
//                 <th class='js-table-position'>${index + 1}</th>
//                 <td>${country.name}</td>
//                 <td>${country.capital || '-'}</td>
//                 <td>${country.currency.name} ${country.currency.symbol || ''}</td>
//                 <td>${country.language.name}</td>
//             </tr>
//         `;
//     });
//     window.scrollTo(0, scrollPosition);
//   });
// };

// drawTable();

// searchButton.addEventListener('click', () => {
//   const searchConditions: string[] = [];
//   searchFields.forEach((input) => {
//     const inputValue = input.value.trim();
//     const fieldName = input.getAttribute('data-column');
//     if (inputValue !== '') {
//       searchConditions.push(`${fieldName}_like=${inputValue}`);
//     }
//   });
//   searchFor = searchConditions.join('&');
//   drawTable();
// });

// loadMore.addEventListener('click', () => {
//   limit += 20;
//   drawTable();
// });

// const sortButtons = document.querySelectorAll('.js-sort');

// sortButtons.forEach((button) => {
//   button.addEventListener('click', () => {
//     const column = button.getAttribute('data-column');
//     if (sortColumn === column) {
//       sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
//     } else {
//       sortColumn = column;
//       sortOrder = 'asc';
//     }
//     drawTable();
//   });
// });
