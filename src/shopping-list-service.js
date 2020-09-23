const shoppingService = {
  getAllItems(db) {
    return db.select('*').from('shopping_list');
  },
  insertItem(db, newItem) {
    return db('shopping_list')
      .insert(newItem)
      .returning('*')
      .then(data => { return data[0]; });
  },
  getById(db, id) {
    return db('shopping_list').select('*').where('id', id).first()
  },
  deleteItem(db, id) {
    return db('shopping_list')
      .where({ id })
      .delete();
  },
  updateItem(db, id, newData) {
    return db('shopping_list')
      .where({ id })
      .update(newData);
  }
};



module.exports = shoppingService;


