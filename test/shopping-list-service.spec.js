const shoppingService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe('Shopping service object', function () {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'First test item!',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '12.00',
      category: 'Main',
      checked: false
    },
    {
      id: 2,
      name: 'Second test item!',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '21.00',
      category: 'Snack',
      checked: false
    },
    {
      id: 3,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      category: 'Lunch',
      checked: false
    },
    {
      id: 4,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      category: 'Breakfast',
      checked: false
    },
  ];


  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });
  before(() => db('shopping_list').truncate());
  before(() => {
    return db.into('shopping_list')
      .insert(testItems);
  });
  afterEach(() => {
    return db('shopping_list').truncate();
  });
  after(() => {
    db.destroy();
  });
  describe('getAllItems', () => {
    it('should return all items in db', () => {
      return shoppingService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testItems);
        });
    });
  });
  describe('insertItem', () => {
    it('should add a new item', () => {
      const newItem = {
        name: 'Fourth test item!',
        date_added: new Date('1919-12-22T16:28:32.615Z'),
        price: '0.99',
        category: 'Breakfast',
      };
      return shoppingService.insertItem(db, newItem)
        .then(actual => {
          expect(actual.name).to.eql(newItem.name);
          expect(actual.date_added).to.eql(newItem.date_added);
          expect(actual.price).to.eql(newItem.price);
          expect(actual.category).to.eql(newItem.category);
          expect(actual.id).to.exist;
        });
    });
  });
  describe('getById', () => {
    before(() => {
      return db.into('shopping_list')
        .insert(testItems);
    });
    it('should return an item by id', () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];

      return shoppingService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdTestItem.id,
            name: thirdTestItem.name,
            date_added: thirdTestItem.date_added,
            price: thirdTestItem.price,
            category: thirdTestItem.category,
            checked: thirdTestItem.checked
          });
        });
    });
  });
  describe('deleteItem', () => {
    before(() => {
      return db.into('shopping_list')
        .insert(testItems);
    });
    it('removes article by id from shopping_list table', () => {
      const itemId = 3;
      return shoppingService.deleteItem(db, itemId)
        .then(() => shoppingService.getAllItems(db))
        .then(actual => {
          const expected = testItems.filter(item => item.id !== itemId);
          expect(actual).to.eql(expected);
        });
    });
  });
  describe('updateItem', () => {
    before(() => {
      return db.into('shopping_list')
        .insert(testItems);
    });
    it('updates an item in shopping_list', () => {
      const idToUpdate = 3;
      const newItemData = {
        name: 'updated test item!',
        date_added: new Date('1919-12-22T16:28:32.616Z'),
        price: '4.00',
        category: 'Main',
        checked: false
      };
      return shoppingService.updateItem(db, idToUpdate, newItemData)
        .then(() => shoppingService.getById(db, idToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idToUpdate,
            ...newItemData,
          })
        })
    })
  })
});
