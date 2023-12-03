
import { DataTypes } from "sequelize";
import db from "../configs/db.js";

const Log = db.define('tbb_log', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Agrega más campos según sea necesario
});
export default Log;