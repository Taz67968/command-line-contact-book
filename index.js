import chalk from "chalk";
import readline from "readline";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg

dotenv.config({path: '.env'});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      phone_number VARCHAR(50),
      email VARCHAR(100)
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log(
      chalk.green("Database initialized and contacts table is ready.")
    );
  } catch (error) {
    console.error(chalk.red("Error initializing the database:"), error);
  }
};

const addContact = async (name, phone_number, email) => {
  const insertQuery = `
    INSERT INTO contacts (name, phone_number, email)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  try {
    const result = await pool.query(insertQuery, [name, phone_number, email]);
    const contact = result.rows[0];
    console.log(
      chalk.blue(
        `Contact added: ${contact.name} - ${contact.phone_number} - ${contact.email}`
      )
    );
  } catch (error) {
    console.error(chalk.red("Error adding contact:"), error);
  }
};

const viewContacts = async () => {
  const selectQuery = "SELECT * FROM contacts ORDER BY id ASC;";
  try {
    const result = await pool.query(selectQuery);

    if (result.rows.length === 0) {
      console.log(chalk.red("No contacts available.\n"));
    } else {
      const formatted = {};
      result.rows.forEach((contact) => {
        formatted[`${contact.id}`] = {
          Name: contact.name,
          Phone: contact.phone_number,
          Email: contact.email,
        };
      });
      console.table(formatted);
    }
  } catch (error) {
    console.error(chalk.red("Error viewing contacts:"), error);
  }
};

const editContact = async (id, newName, newPhone, newEmail) => {
  const getQuery = "SELECT * FROM contacts WHERE id = $1;";
  const updateQuery = `
    UPDATE contacts
    SET name = $1, phone_number = $2, email = $3
    WHERE id = $4
    RETURNING *;
  `;
  try {
    const result = await pool.query(getQuery, [id]);
    if (result.rows.length === 0) {
      console.log(chalk.red(`No contact found with ID ${id}.`));
      return;
    }

    const contact = result.rows[0];
    const updatedName = newName.trim() !== "" ? newName : contact.name;
    const updatedPhone = newPhone.trim() !== "" ? newPhone : contact.phone_number;
    const updatedEmail = newEmail.trim() !== "" ? newEmail : contact.email;

    const updated = await pool.query(updateQuery, [
      updatedName,
      updatedPhone,
      updatedEmail,
      id,
    ]);

    console.log(
      chalk.green(
        `Contact updated: ${updated.rows[0].name} - ${updated.rows[0].phone_number} - ${updated.rows[0].email}`
      )
    );
  } catch (error) {
    console.error(chalk.red("Error editing contact:"), error);
  }
};





const removeContact = async (id) => {
  const deleteQuery = "DELETE FROM contacts WHERE id = $1 RETURNING *;";
  try {
    const result = await pool.query(deleteQuery, [id]);
    if (result.rowCount > 0) {
      console.log(chalk.green("Contact removed."));
    } else {
      console.log(chalk.red("Invalid contact ID."));
    }
  } catch (error) {
    console.error(chalk.red("Error removing contact:"), error);
  }
};

const searchContact = async (name) => {
  const searchQuery = "SELECT * FROM contacts WHERE LOWER(name) = LOWER($1);";
  try {
    const result = await pool.query(searchQuery, [name]);
    if (result.rows.length > 0) {
      result.rows.forEach((contact) => {
        console.log(
          chalk.bold.green(
            `Contact found: ${contact.name} - ${contact.phone_number} - ${contact.email}`
          )
        );
      });
    } else {
      console.log(
        chalk.bold.red(`Error: Contact with name "${name}" does not exist.`)
      );
    }
  } catch (error) {
    console.error(chalk.red("Error searching contact:"), error);
  }
};

const showMenu = () => {
  console.log(
    chalk.bold.blue(
      "\nOptions: 1) Add contact 2) View contacts 3) Remove contact 4) Search contacts 5) Edit contact 6) Quit  \n"
    )
  );
};

const main = async () => {
  showMenu();

  await viewContacts(); 

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        rl.question("Enter name: ", (name) => {
          rl.question("Enter phone number: ", (phone_number) => {
            rl.question("Enter email: ", async (email) => {
              await addContact(name, phone_number, email);
              main(); 
            });
          });
        });
        break;
      case "2":
        main(); 
        break;
      case "3":
        rl.question("Enter the contact ID to remove: ", async (id) => {
          await removeContact(parseInt(id));
          main();
        });
        break;
      case "4":
        rl.question("Enter the name to search: ", async (name) => {
          await searchContact(name);
          main();
        });
        break;
      case "6":
        rl.close();
        pool
          .end()
          .then(() => console.log(chalk.green("Database connection closed.")))
          .catch((err) => console.error(chalk.red("Error closing the pool:"), err));
        break;
      default:
        console.log(chalk.red("Invalid choice. Please try again."));
        main();
        break;
        case "5":
          rl.question("Enter the contact ID to edit: ", async (id) => {
            const contactId = parseInt(id);
            rl.question("New name (leave blank to keep current): ", (name) => {
              rl.question("New phone number (leave blank to keep current): ", (phone) => {
                rl.question("New email (leave blank to keep current): ", async (email) => {
                  await editContact(contactId, name, phone, email);
                  main();
                });
              });
            });
          });
          break;
  
    }
  });
};


initDB().then(() => {
  main();
});
