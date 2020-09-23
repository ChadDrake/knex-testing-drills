require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

const searchTerm = 'fish';

function searchByName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

searchByName('fish');

function getAllItemsPaginated(pageNumber) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (pageNumber - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

getAllItemsPaginated(1);

function getRecentItems(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then((result) => console.log(result));
}

getRecentItems(3);

function totalCost() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .sum('price as total')
    .groupBy('category')
    .then(result => console.log(result))
    .finally(() => knexInstance.destroy());
}

totalCost();