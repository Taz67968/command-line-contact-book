import fs from "fs";
import chalk from "chalk";
import readline from "readline";
import { group } from "console";

const CONTACTS_FILE = "./contacts.json";

let contacts = [];
if (fs.existsSync(CONTACTS_FILE)) {
  try {
    const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
    contacts = JSON.parse(data);
  } catch (err) {
    console.error(chalk.red("Error reading contacts file:"), err);
    contacts = [];
  }
} else {
  contacts = [];
}

const saveContacts = () => {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  } catch (err) {
    console.error(chalk.red("Error writing contacts file:"), err);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const addContact = (name, phone_number, email,group) => {
  contacts.push({ name, phone_number, email, group });
  saveContacts();
  console.log(chalk.bold.green(`Contact added: ${name} - ${phone_number} - ${email} - ${group}`));
};


const viewContacts = () => {
  if (contacts.length === 0) {
    console.log(chalk.red("No contacts available."));
  } else {
    const header = `${"No.".padEnd(5)} ${"Name".padEnd(20)} ${"Phone Number".padEnd(20)} ${"Email"} ${"group"}`;
    console.log(chalk.blue(header));
    console.log(chalk.blue("-".repeat(60)));
    contacts.forEach((contact, index) => {
      const row = `${(index + 1).toString().padEnd(5)} ${contact.name.padEnd(20)} ${contact.phone_number.padEnd(20)} ${contact.email} ${contact.group}`;
      console.log(chalk.yellow(row));
    });
  }
};

const removeContact = (contactNumber) => {
  if (contactNumber > 0 && contactNumber <= contacts.length) {
    contacts.splice(contactNumber - 1, 1);
    saveContacts();
    console.log(chalk.red("Contact removed."));
  } else {
    console.log(chalk.red("Invalid contact number."));
  }
};

const searchContact = (name) => {
  const contactFound = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  if (contactFound) {
    console.log(chalk.bold.green(`Contact found: ${contactFound.name} - ${contactFound.phone_number} - ${contactFound.email} - ${contactFound.group}`));
  } else {
    console.log(chalk.bold.red(`Error: Contact with name "${name}" does not exist.`));
  }
};

const editContact = (contactNumber, newName, newPhone, newEmail) => {
  if (contactNumber > 0 && contactNumber <= contacts.length) {
    const contact = contacts[contactNumber - 1];
    contact.name = newName.trim() !== "" ? newName : contact.name;
    contact.phone_number = newPhone.trim() !== "" ? newPhone : contact.phone_number;
    contact.email = newEmail.trim() !== "" ? newEmail : contact.email;
    contact.group = newGroup.trim() !== "" ? newGroup : contact.group;
    saveContacts();
    console.log(chalk.bold.green("Contact updated."));
  } else {
    console.log(chalk.red("Invalid contact number."));
  }
};

const showMenu = () => {
  console.log(chalk.bold.blue("\nOptions: 1. Add contact | 2. View contacts | 3. Remove contact | 4. Search contact | 5. Edit contact | 6. Quit"));
  
  if (contacts.length > 0) {
    console.log(chalk.bold.blue("\nExisting Contacts:"));
    const header = `${"No.".padEnd(5)} ${"Name".padEnd(20)} ${"Phone Number".padEnd(20)} ${"Email".padEnd(20)} ${"group"}`;
    console.log(chalk.blue(header));
    console.log(chalk.blue("-".repeat(80)));
    contacts.forEach((contact, index) => {
      const row = `${(index + 1).toString().padEnd(5)} ${contact.name.padEnd(20)} ${contact.phone_number.padEnd(20)} ${contact.email.padEnd(20)} ${contact.group}`;
      console.log(chalk.yellow(row));
    });
    console.log("");
  } else {
    console.log(chalk.red("\nNo contacts available.\n"));
  }
};

const main = () => {
  showMenu();
  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        rl.question("Enter name: ", (name) => {
          rl.question("Enter phone number: ", (phone_number) => {
            rl.question("Enter your group (family,work,personal): ",(group)=>{
                rl.question("Enter email: ", (email) => {
                    addContact(name, phone_number, email, group)
                    main();
                  });
                });
              });

            })
            
        break;
      case "2":
        viewContacts();
        main();
        break;
      case "3":
        rl.question("Enter the contact number to remove: ", (num) => {
          removeContact(parseInt(num));
          main();
        });
        break;
      case "4":
        rl.question("Enter the name to search: ", (name) => {
          searchContact(name);
          main();
        });
        break;
      case "5":
        rl.question("Enter the contact number to edit: ", (num) => {
          const contactNumber = parseInt(num);
          if (contactNumber > 0 && contactNumber <= contacts.length) {
            rl.question("Enter new name (leave blank to keep unchanged): ", (newName) => {
              rl.question("Enter new phone number (leave blank to keep unchanged): ", (newPhone) => {
                rl.question("Enter new Group (leave blank to keep unchanged): ", (newGroup) => {
                rl.question("Enter new email (leave blank to keep unchanged): ", (newEmail) => {
                  editContact(contactNumber, newName, newPhone, newEmail, newGroup);
                  main();
                });
              });
            });
        })
          } else {
            console.log(chalk.red("Invalid contact number."));
            main();
          }
        });
        break;
      case "6":
        rl.close();
        break;
      default:
        console.log(chalk.red("Invalid choice. Please try again."));
        main();
        break;
    }
  });
};

main();
