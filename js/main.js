let modal = document.querySelector(".add-modal")
let deleteConfirm = document.querySelector(".delete-modal")
let confirmBtn = document.querySelector(".confirm")
let cancelDelete = document.querySelector(".cancelDelete")
let addBtn = document.getElementById("add_contact")
let saveBtn = document.querySelector(".save-btn")
let cancelBtn = document.querySelector(".cancel")
let tbody = document.getElementById("tbody")
let nameImg = document.querySelector(".name-img img")
let resetImg = document.getElementById("resetImg")
let modalAvatar = document.querySelector(".modal-avatar")

let nameInput = document.getElementById("contact_form_name")
let phoneInput = document.getElementById("contact_form_phone")
let emailInput = document.getElementById("contact_form_email")
let addressInput = document.getElementById("contact_form_address")
let tagsInput = document.getElementById("contact_form_tags")

let searchInput = document.getElementById("search")
let filterBtn = document.getElementById("filter")
let filterSelect = document.querySelector(".tags-filter")
let viewMoreBtn = document.getElementById("viewMoreBtn")

let contactList = JSON.parse(localStorage.getItem("contact") || "[]")
let lastContactId = contactList.length
let editId = null
let deleteIndex = null
let selectedTag = null
let contactsPerPage = 10
let currentVisibleCount = contactsPerPage













//-----------------------------------initial avatar
const getInitials = (name) => {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
}



//-----------------------------------render contacts
let renderContacts = () => {
    //sort by name alfabetical order (case-insensitive)
    contactList.sort((a, b) => a.contactName.toLowerCase().localeCompare(b.contactName.toLowerCase()))


    //search part
    let searchTerm = searchInput.value.toLowerCase()
    let filteredList = contactList.filter(contact =>
        contact.contactName.toLowerCase().includes(searchTerm)
    )


    //filter by selected tag
    if (selectedTag === "Favorite") {
        filteredList = filteredList.filter(c => c.isFavorite);
    } else if (selectedTag && selectedTag !== "All") {
        filteredList = filteredList.filter(c => c.tags === selectedTag);
    }
    document.querySelector(".contact-header h1 span").innerText = "(" + filteredList.length + ")"//get length


    //pagination
    tbody.innerHTML = "";
    let visibleContacts = filteredList.slice(0, currentVisibleCount);


    //rendering----
    if (visibleContacts.length === 0) {
        tbody.innerHTML = `
        <tr>
        <td colspan="6" style="text-align: center;">
        <img style="width: 250px;" src="images/nocontacts.png" alt="">
        <h2 style="font-size: 22px;" >No Contact Matchs What You Want!!</h2>
        <!--<h2 style="font-size: 22px;" >No Contact Available!</h2>-->
        </td>
        </tr>`
        return
    }
    tbody.innerHTML = ""
    visibleContacts.forEach((contact, index) => {
        let tr = document.createElement("tr")
        tr.dataset.id = contact.contactId
        tr.innerHTML = `
      <!--<td>${contact.contactId}</td>-->
      <!--<td>${index + 1}</td>-->
      <td>
      ${contact.imageData
                ? `<img class="img-avatar" src="${contact.imageData}" />`
                : `<div class="initials-avatar">${getInitials(contact.contactName)}</div>`}
      </td>
      <td>${contact.contactName}</td>
      <td>${contact.contactPhone}</td>
      <td>${contact.contactEmail}</td>
      <td>${contact.contactAddress}</td>
      <!--<td>${contact.tags == "Work" ? '<i class="fa-solid fa-briefcase"></i>' : contact.tags == "Friend" ? '<i class="fa-solid fa-user-group"></i>' : contact.tags == "Family" ? '<i class="fa-solid fa-family"></i>' : "--"}</td>-->
      <td>
      ${{
                "Work": '<i class="fa-solid fa-briefcase"></i>',
                "Friend": '<i class="fa-solid fa-user-group"></i>',
                "Family": '<i class="fa-solid fa-house-chimney-window"></i>'
            }[contact.tags] || "--"}
      </td>
      <td>
      ${contact.isFavorite ? '<i class="fa-solid fa-star"></i>' : "<i class='fa-regular fa-star'></i>"}
      </td>
      <td>
        <i class="fa-solid fa-pen-to-square edit-icon"></i>
        <i class="fa-solid fa-trash delete-icon"></i>
      </td>
    `
        tbody.appendChild(tr)
    })

    //show/hide "View More" button
    viewMoreBtn.style.display = currentVisibleCount < filteredList.length ? "block" : "none";
}

//-----------------------------------reset
let resetForm = () => {
    document.getElementById("contactImage").value = ""
    nameImg.src = ""
    nameInput.value = ""
    phoneInput.value = ""
    emailInput.value = ""
    addressInput.value = ""
    tagsInput.value = "--"
    editId = null
    document.querySelectorAll(".input-error").forEach(input => {
        input.classList.remove("input-error")
    });
    document.querySelectorAll(".error-message").forEach(msg => {
        msg.style.display = "none"
    });
}

//-----------------------------------save button handling
let saveContact = () => {
    if (!validateForm()) return;
    //more enhance?
    let imgSrc = ""
    if (nameImg.src == ""
        || nameImg.src == "file:///E:/web/smart%20academy/level%202/contact%20list%20project/my%20project/contact%20list%20(CRUD%20app).html"
        || nameImg.src == "file:///E:/web/smart%20academy/level%202/contact%20list%20project/my%20project/images/defualtUser.png"
    ) {
        imgSrc = ""
    } else {
        imgSrc = nameImg.src
    }
    if (editId) {
        const index = contactList.findIndex(c => c.contactId === editId)
        contactList[index] = {
            contactId: editId,
            contactName: nameInput.value,
            contactPhone: phoneInput.value,
            contactEmail: emailInput.value,
            contactAddress: addressInput.value,
            isFavorite: contactList[index].isFavorite,
            tags: tagsInput.value,
            imageData: imgSrc
        }
        showToast("edited")
    } else {
        lastContactId += 1
        contactList.push({
            contactId: lastContactId,
            contactName: nameInput.value,
            contactPhone: phoneInput.value,
            contactEmail: emailInput.value,
            contactAddress: addressInput.value,
            isFavorite: false,
            tags: tagsInput.value,
            imageData: imgSrc
        })
        showToast("created")
    }
    localStorage.setItem("contact", JSON.stringify(contactList))
    currentVisibleCount = 10
    renderContacts()
    resetForm()
    modal.style.display = "none"
}


//-----------------------------------modal btns
addBtn.addEventListener("click", () => {
    nameImg.style.display = "inline"
    nameImg.src = "images/defualtUser.png"///
    modalAvatar.style.display = "none"///
    modal.style.display = "block"
    resetImg.style.display = "none"
})
cancelBtn.addEventListener("click", () => {
    resetForm()
    modal.style.display = "none"
})
saveBtn.addEventListener("click", () => {
    saveContact()
})


//-----------------------------------confirm delete
confirmBtn.addEventListener("click", () => {
    if (deleteIndex !== null) {
        contactList.splice(deleteIndex, 1)
        contactList.forEach((c, i) => c.contactId = i + 1)
        lastContactId = contactList.length
        localStorage.setItem("contact", JSON.stringify(contactList))
        showToast("deleted")
        renderContacts()
        deleteConfirm.style.display = "none"
        deleteIndex = null
    }
})
cancelDelete.addEventListener("click", () => {
    deleteConfirm.style.display = "none"
})


//-----------------------------------edit & delete handling
tbody.addEventListener("click", e => {
    let tr = e.target.closest("tr")
    let id = parseInt(tr.dataset.id)
    let index = contactList.findIndex(c => c.contactId === id)
    //edit
    if (e.target.classList.contains("edit-icon")) {
        let contact = contactList[index]
        //image setting
        if (contact.imageData) {
            nameImg.style.display = "inline"
            modalAvatar.style.display = "none"
            nameImg.src = contact.imageData
        } else {
            nameImg.style.display = "none"
            modalAvatar.style.display = "flex"
            modalAvatar.innerText = getInitials(contact.contactName)
        }
        resetImg.style.display = contact.imageData ? "inline-block" : "none";
        document.getElementById("contactImage").addEventListener("change", () => {
            nameImg.style.display = "inline"
            modalAvatar.style.display = "none"
            resetImg.style.display = "inline-block"
        })
        nameInput.value = contact.contactName
        phoneInput.value = contact.contactPhone
        emailInput.value = contact.contactEmail
        addressInput.value = contact.contactAddress
        tagsInput.value = contact.tags
        editId = id
        modal.style.display = "block"
    }
    //delete
    if (e.target.classList.contains("delete-icon")) {
        deleteConfirm.style.display = "block"
        deleteIndex = index;
    }
    //favorite
    if (e.target.classList.contains("fa-star")) {
        contactList[index].isFavorite = !contactList[index].isFavorite;
        localStorage.setItem("contact", JSON.stringify(contactList));
        renderContacts();
    }
})
renderContacts()//initial rendering


















//-----------------------------------search part
searchInput.addEventListener("input", () => {
    renderContacts();
});



//-----------------------------------pagination part
document.getElementById("viewMoreBtn").addEventListener("click", () => {
    currentVisibleCount += contactsPerPage;
    renderContacts();
});



//-----------------------------------tags filter
filterBtn.addEventListener("click", () => {
    filterSelect.classList.toggle("tags-filter-display")
})
filterSelect.addEventListener("click", (e) => {
    let tag = e.target.dataset.tag || e.target.parentElement.dataset.tag;
    selectedTag = tag;
    const iconMap = {
        "All": '<i class="fa-solid fa-filter"></i>',
        "Family": '<i class="fa-solid fa-house-chimney-window"></i>',
        "Friend": '<i class="fa-solid fa-user-group"></i>',
        "Work": '<i class="fa-solid fa-briefcase"></i>',
        "Favorite": '<i class="fa-solid fa-star"></i>'
    }
    filterBtn.querySelector("i").outerHTML = iconMap[tag] || ""
    currentVisibleCount = 10;
    renderContacts();
})
// Add click event to close filter when clicking elsewhere
document.addEventListener("click", (e) => {
    if (!filterBtn.contains(e.target) && !filterSelect.contains(e.target)) {
        filterSelect.classList.remove("tags-filter-display");
    }
})




//-----------------------------------dark mode
const toggle = document.getElementById('toggle')
const isDarkMode = localStorage.getItem("theme") === "dark"
if (isDarkMode) {
    document.body.classList.add("dark")
    toggle.classList.remove('dark')
} else {
    document.body.classList.remove("dark")
    toggle.classList.add('dark')
}
toggle.addEventListener('click', () => {
    document.body.classList.toggle("dark")
    toggle.classList.toggle('dark')
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});



//-----------------------------------validation
function validateForm() {
    let isValid = true
    const name = nameInput.value.trim()
    const phone = phoneInput.value.trim()
    const email = emailInput.value.trim()
    const address = addressInput.value.trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/

    const showError = (input, errorId, condition, errorMessage) => {
        const errorElement = document.getElementById(errorId)
        if (condition) {
            input.classList.add("input-error")
            errorElement.textContent = errorMessage
            errorElement.style.display = "block"
            isValid = false
        } else {
            input.classList.remove("input-error")
            errorElement.style.display = "none"
        }
    }

    //check duplicates
    const isEmailDuplicate = contactList.some(c =>
        c.contactEmail === email && c.contactId !== editId
    );
    const isPhoneDuplicate = contactList.some(c =>
        c.contactPhone === phone && c.contactId !== editId
    );

    showError(nameInput, "error-name", !name, "Name is required.")
    showError(phoneInput, "error-phone", !phoneRegex.test(phone), "Valid phone required (e.g., 010-123-4567 or 010-1234-5678)")
    showError(emailInput, "error-email", !emailRegex.test(email), "Valid email required (e.g., user@example.com)")
    showError(addressInput, "error-address", !address, "Address is required.")

    //check duplicates only if phone/email are valid
    if (phoneRegex.test(phone)) {
        showError(phoneInput, "error-phone", isPhoneDuplicate, "This phone number already exists.");
    }
    if (emailRegex.test(email)) {
        showError(emailInput, "error-email", isEmailDuplicate, "This email already exists.");
    }

    return isValid
}



//-----------------------------------export into json file
document.getElementById("exportBtn").addEventListener("click", () => {
    const dataStr = JSON.stringify(contactList, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contacts.json"
    a.click()
    URL.revokeObjectURL(url)
})



//-----------------------------------modal image render
document.getElementById("contactImage").addEventListener("change", function () {
    const file = this.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            nameImg.src = reader.result
        }
        reader.readAsDataURL(file)
    } else {
        nameImg.src = null
    }
})
resetImg.addEventListener("click", () => {
    nameImg.src = ""
    nameImg.style.display = "none"
    modalAvatar.style.display = "flex"
    modalAvatar.innerText = getInitials(nameInput.value)
    resetImg.style.display = "none"
})







//-----------------------------------keyboard navigation inside modal
document.addEventListener("keydown", (e) => {
    if (modal.style.display === "block") {
        if (e.key === "Escape") {
            resetForm()
            modal.style.display = "none"
        } else if (e.key === "Enter") {
            saveContact()
        }
    }
    if (deleteConfirm.style.display === "block") {
        if (e.key === "Escape") {
            deleteConfirm.style.display = "none"
        } else if (e.key === "Enter") {
            confirmBtn.click()
        }
    }
})




//-----------------------------------apply toast
let toastTimeout;
function showToast(status) {
    let toast = document.querySelector(".tost");
    toast.classList.toggle("show")

    if (status == "created")
        toast.children[0].innerText = "Contact Created Successfully!!"
    else if (status == "edited")
        toast.children[0].innerText = "Contact Edited Successfully!!"
    else if (status == "deleted")
        toast.children[0].innerText = "Contact Deleted Successfully!!"

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.toggle("show")
    }, 2000);
    toast.querySelector("i").addEventListener("click", () => {
        toast.classList.remove("show")
        clearTimeout(toastTimeout);
    });
}
















//testing error ==> if I reset image of contact then put the same image again it don't listen