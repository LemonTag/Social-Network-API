// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'Reaction_id', 
  onDelete:'CASCADE'
})
// Categories have many Products
Category.hasMany(Product, {
  foreignKey:'Thought_id'
})
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag, 
  foreignKey: 'User_id'
})


module.exports = {
  Reaction,
  Thought,
  User,
};
