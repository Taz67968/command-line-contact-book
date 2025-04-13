import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let contacts = [];

const addContact = (name, phone_number, email) => {
  contacts.push({ name, phone_number, email });
  console.log(`Contact added ${name} ${phone_number} ${email}`);
};

const viewContact = () => {
  if (contacts.length === 0) {
    console.log("no contact");
  } else {
    contacts.forEach((contact, index) => {
      console.log(
        `${index + 1}, ${contact.name} - ${contact.phone_number} - ${
          contact.email
        }`
      );
    });
  }
};

const removeContact = (contactNumber) => {
  if (contactNumber > 0 && contactNumber <= contacts.length) {
    const removed = contacts.splice(contactNumber - 1, 1);
    console.log("Contact removed");
  } else {
    console.log("invalid contact number.");
  }
};

const showMenu = () => {
  console.log("\nContact manager");
  console.log("1. Add contact");
  console.log("2. View contacts");
  console.log("3. Remove contact");
  console.log("4. Quit");
};

const main = () => {
  showMenu();
  rl.question("Enter your choice:", (choice) => {
    switch (choice) {
      case "1":
        rl.question("Enter name:", (name) => {
          rl.question("Enter the phone:", (phone_number) => {
            rl.question("Enter email:", (email) => {
              addContact(name, phone_number, email);
              main();
            });
          });
        });
        break;
      case "2":
        viewContact();
        main();
        break;
      case "3":
        rl.question("Enter the contact number too remove", (num) => {
          removeContact(parseInt(num));
          main();
        });
        break;

      case "4":
        rl.close();
        break;
      default:
        console.log("invalid choice. Please try again");
        main();
        break;
    }
  });
};

main();
