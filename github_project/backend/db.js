const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

// SQLite-Datenbankpfad
const dbPath = path.join(__dirname, 'database.sqlite');

// Sequelize-Instanz erstellen
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false // Logging deaktivieren für Produktionsumgebung
});

// Modelle definieren

// User-Modell
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('admin', 'studio', 'kunde'),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Studio-Modell
const Studio = sequelize.define('Studio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'pending'
  },
  registration_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Customer-Modell
const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Treatment-Modell
const Treatment = sequelize.define('Treatment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Availability-Modell
const Availability = sequelize.define('Availability', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  day_of_week: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Appointment-Modell
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Review-Modell
const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Favorite-Modell
const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Beziehungen definieren

// User-Studio Beziehung (1:1)
User.hasOne(Studio, { foreignKey: 'user_id' });
Studio.belongsTo(User, { foreignKey: 'user_id' });

// User-Customer Beziehung (1:1)
User.hasOne(Customer, { foreignKey: 'user_id' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

// Studio-Treatment Beziehung (1:n)
Studio.hasMany(Treatment, { foreignKey: 'studio_id' });
Treatment.belongsTo(Studio, { foreignKey: 'studio_id' });

// Studio-Availability Beziehung (1:n)
Studio.hasMany(Availability, { foreignKey: 'studio_id' });
Availability.belongsTo(Studio, { foreignKey: 'studio_id' });

// Customer-Appointment Beziehung (1:n)
Customer.hasMany(Appointment, { foreignKey: 'customer_id' });
Appointment.belongsTo(Customer, { foreignKey: 'customer_id' });

// Studio-Appointment Beziehung (1:n)
Studio.hasMany(Appointment, { foreignKey: 'studio_id' });
Appointment.belongsTo(Studio, { foreignKey: 'studio_id' });

// Treatment-Appointment Beziehung (1:n)
Treatment.hasMany(Appointment, { foreignKey: 'treatment_id' });
Appointment.belongsTo(Treatment, { foreignKey: 'treatment_id' });

// Customer-Review Beziehung (1:n)
Customer.hasMany(Review, { foreignKey: 'customer_id' });
Review.belongsTo(Customer, { foreignKey: 'customer_id' });

// Studio-Review Beziehung (1:n)
Studio.hasMany(Review, { foreignKey: 'studio_id' });
Review.belongsTo(Studio, { foreignKey: 'studio_id' });

// Appointment-Review Beziehung (1:1)
Appointment.hasOne(Review, { foreignKey: 'appointment_id' });
Review.belongsTo(Appointment, { foreignKey: 'appointment_id' });

// Customer-Favorite-Studio Beziehung (n:m)
Customer.belongsToMany(Studio, { through: Favorite, foreignKey: 'customer_id' });
Studio.belongsToMany(Customer, { through: Favorite, foreignKey: 'studio_id' });

// Funktion zum Testen der Datenbankverbindung
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Datenbankverbindung erfolgreich hergestellt');
    return true;
  } catch (error) {
    console.error('Fehler bei der Datenbankverbindung:', error);
    return false;
  }
}

// Funktion zum Initialisieren der Datenbank
async function initializeDatabase() {
  try {
    // Tabellen erstellen (oder synchronisieren)
    await sequelize.sync({ alter: true });
    console.log('Datenbank erfolgreich initialisiert');
    return true;
  } catch (error) {
    console.error('Fehler bei der Datenbankinitialisierung:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  User,
  Studio,
  Customer,
  Treatment,
  Availability,
  Appointment,
  Review,
  Favorite,
  testConnection,
  initializeDatabase
};
