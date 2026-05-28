
<div align="center">
  <img src="https://i.ibb.co/qMq06ytj/wpdb-5.png" alt="WPDB Banner" width="100%">
  <h1>WPDB - Windows Phone Database</h1>
</div>

## What is WPDB?

**WPDB** is essentially the sister project to **LumiaDB**. 

While LumiaDB focuses strictly on, well you guessed it, Nokia and Microsoft Lumia devices, the Windows Phone ecosystem was much bigger than that. WPDB is dedicated to archiving ROMs, files, and guides for **all the other OEMs** that also happened to make Windows Phones (such as HTC, Samsung, HP, Alcatel, Acer, and more).

We aim to keep the history, firmware, and guides for these rare devices alive and accessible.

---

## Contributing

We love community contributions! Whether you are adding a new device, a missing ROM link, or writing a tutorial, your help is appreciated. 

### Important JSON Formatting Rule
When adding data to our JSON files (especially in the guides), **you must escape double quotes**. If you use raw double quotes inside a JSON string, it will break the database.

To escape a quote, simply put a backslash (`\`) right before it.

**Incorrect:**
```json
"description": "Then click on the "Download" button to continue."
```

**Correct:**
```json
"description": "Then click on the \"Download\" button to continue."
```

Need more help with escaping characters? Check out this quick [GeeksForGeeks guide](https://www.geeksforgeeks.org/javascript/how-to-escape-double-quotes-in-json/).

---

## Special Thanks

A massive thank you to the following individuals for their invaluable help, support, and contributions to keeping this project alive:

* **ACPI Fixed Feature Button**
* **somerandomusername2**
* **andrew64dev**

---

## Links & Resources
* **Main Database / Website:** [wpdb.lumiadb.com](https://wpdb.lumiadb.com)
* **LumiaDB (Sister Project):** [lumiadb.com](https://lumiadb.com)
* **File Archive:** [Internet Archive Mirror](https://archive.org/details/wpdb_archive)
