import axios from 'axios';

type Country = {
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

const countryTable = document.querySelector<HTMLElement>('.js-table-body');
let limit = 20;
let scrollPosition = 0;
let sortOrder = 'asc';
let sortColumn = 'name';
const loadMore = document.querySelector('.js-load-more');

const drawTable = () => {
  axios.get<Country[]>(`http://localhost:3004/countries?_limit=${limit}&_sort=${sortColumn}&_order=${sortOrder}&q=${}`).then(({ data }) => {
    scrollPosition = window.scrollY;
    countryTable.innerHTML = '';
    data.forEach((country, index) => {
      countryTable.innerHTML += `
            <tr data-index='${index}'>
                <th class='js-table-position'>${index + 1}</th>
                <td>${country.name}</td>
                <td>${country.capital || '-'}</td>
                <td>${country.currency.name} ${country.currency.symbol || ''}</td>
                <td>${country.language.name}</td>
            </tr>
        `;
    });
    window.scrollTo(0, scrollPosition);
  });
};

drawTable();

loadMore.addEventListener('click', () => {
  limit += 20;
  drawTable();
});

const sortButtons = document.querySelectorAll('.js-sort');

sortButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const column = button.getAttribute('data-column');
    if (sortColumn === column) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortOrder = 'asc';
    }
    drawTable();
  });
});
