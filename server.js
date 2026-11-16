
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

app.use(express.json());

let menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

function requestLogger(req, res, next) {
  console.log('-----------------------------');
  console.log('Request:', req.method, req.originalUrl);
  console.log('Timestamp:', new Date().toISOString());

  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body);
  }

  next();
}

app.use(requestLogger);

async function validateMenuItem(req, res, next) {
  if (req.body.available === undefined) {
    req.body.available = true;
  }

  const validators = [
    body('name')
      .isString().withMessage('Name must be a string')
      .trim()
      .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

    body('description')
      .isString().withMessage('Description must be a string')
      .trim()
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

    body('price')
      .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0')
      .toFloat(),

    body('category')
      .isIn(['appetizer', 'entree', 'dessert', 'beverage'])
      .withMessage('Category must be appetizer, entree, dessert, or beverage'),

    body('ingredients')
      .isArray({ min: 1 }).withMessage('Ingredients must be an array with at least one ingredient'),

    body('ingredients.*')
      .isString().withMessage('Each ingredient must be a string')
      .trim()
      .notEmpty().withMessage('Ingredients cannot be empty'),

    body('available')
      .isBoolean().withMessage('Available must be true or false')
      .toBoolean()
  ];

  for (const validator of validators) {
    await validator.run(req);
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
}

app.get('/api/menu', (req, res) => {
  res.status(200).json(menuItems);
});

app.get('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id);
  const menuItem = menuItems.find(item => item.id === id);

  if (!menuItem) {
    return res.status(404).json({
      error: 'Menu item not found',
      message: `No menu item exists with ID ${id}`
    });
  }

  res.status(200).json(menuItem);
});

app.post('/api/menu', validateMenuItem, (req, res) => {
  const newMenuItem = {
    id: Math.max(0, ...menuItems.map(item => item.id)) + 1,
    ...req.body
  };

  menuItems.push(newMenuItem);

  res.status(201).json({
    message: 'Menu item created successfully',
    menuItem: newMenuItem
  });
});

app.put('/api/menu/:id', validateMenuItem, (req, res) => {
  const id = Number(req.params.id);
  const index = menuItems.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Menu item not found',
      message: `No menu item exists with ID ${id}`
    });
  }

  menuItems[index] = {
    id,
    ...req.body
  };

  res.status(200).json({
    message: 'Menu item updated successfully',
    menuItem: menuItems[index]
  });
});

app.delete('/api/menu/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = menuItems.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Menu item not found',
      message: `No menu item exists with ID ${id}`
    });
  }

  const deletedItem = menuItems.splice(index, 1)[0];

  res.status(200).json({
    message: 'Menu item deleted successfully',
    menuItem: deletedItem
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Please provide a properly formatted JSON request body'
    });
  }

  next(err);
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('================================');
    console.log('TASTY BITES API SERVER STARTED');
    console.log(`http://localhost:${PORT}`);
    console.log('================================');
  });
}

module.exports = { app, menuItems };
