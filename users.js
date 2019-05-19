const pool = require("./db").pool;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      response.status(400).send("Couldn t get the users");
      return;
    }
    if (typeof results !== "undefined" && results.rows.length > 0) {
      response.status(200).json(results.rows);
    }
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error || results.rows.length <= 0) {
      response.status(400).send(`There is no user with the ID: ${id}`);
      return;
    }
    response.status(200).json(results.rows);
    return;
  });
};

const createUser = (request, response) => {
  const {
    email,
    password,
    gender,
    address,
    phone_number,
    first_name,
    last_name,
    role,
    company_name,
    company_description,
    number_employee,
    siret,
    state,
    profession
  } = request.body;

  pool.query(
    "INSERT INTO users VALUES (default, $1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id",
    [
      email,
      password,
      gender,
      address,
      phone_number,
      first_name,
      last_name,
      role,
      company_name,
      company_description,
      number_employee,
      siret,
      0,
      profession
    ],
    (error, results) => {
      if (error) {
        console.log(error);

        response
          .status(400)
          .send(
            `Could not create the user with the provided data: ${error.detail}`
          );
        return;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
      return;
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        response.status(400).send(`Couldn't update the user with ID: ${id}`);
        return;
      }
      response.status(200).send(`User updated with ID: ${id}`);
      return;
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send("Couldn't delete the user");
    }
    response.status(200).send(`Deleted User with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
