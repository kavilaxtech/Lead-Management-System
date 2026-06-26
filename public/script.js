const apiUrl = "/api/leads";

const leadForm = document.getElementById("leadForm");
const leadTable = document.getElementById("leadTable");

const leadId = document.getElementById("leadId");
const nameInput = document.getElementById("name");
const companyInput = document.getElementById("company");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const statusInput = document.getElementById("status");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalLeads = document.getElementById("totalLeads");
const newLeads = document.getElementById("newLeads");
const contactedLeads = document.getElementById("contactedLeads");
const qualifiedLeads = document.getElementById("qualifiedLeads");
const closedLeads = document.getElementById("closedLeads");

let leads = [];

// ===============================
// LOAD LEADS
// ===============================

async function loadLeads() {

    try {

        const response = await fetch(apiUrl);

        leads = await response.json();

        applyFilters();

        updateDashboard(leads);

    } catch (error) {

        console.error("Unable to load leads.", error);

    }

}

loadLeads();


// ===============================
// DISPLAY LEADS
// ===============================

function displayLeads(data) {

    leadTable.innerHTML = "";

    data.forEach((lead) => {

        leadTable.innerHTML += `

        <tr>

            <td>${lead.name}</td>

            <td>${lead.company}</td>

            <td>${lead.email}</td>

            <td>${lead.phone || "-"}</td>

            <td>

                <span class="status ${lead.status.toLowerCase()}">

                    ${lead.status}

                </span>

            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editLead(${lead.id})">

                    Edit

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteLead(${lead.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}


// ===============================
// ADD OR UPDATE LEAD
// ===============================

leadForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const lead = {

        name: nameInput.value.trim(),

        company: companyInput.value.trim(),

        email: emailInput.value.trim(),

        phone: phoneInput.value.trim(),

        status: statusInput.value

    };
    

    try {

        if (leadId.value === "") {

            await fetch(apiUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(lead)

            });

        }

        else {

            await fetch(`${apiUrl}/${leadId.value}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(lead)

            });

        }

        leadForm.reset();

        leadId.value = "";

        statusInput.value = "New";

        document.querySelector("#leadForm button").textContent = "Save Lead";

        loadLeads();

    }

    catch (error) {

        console.error(error);

        alert("Unable to save lead.");

    }

});

// ===============================
// EDIT LEAD
// ===============================

async function editLead(id) {

    try {

        const response = await fetch(`${apiUrl}/${id}`);

        const lead = await response.json();

        leadId.value = lead.id;
        nameInput.value = lead.name;
        companyInput.value = lead.company;
        emailInput.value = lead.email;
        phoneInput.value = lead.phone;
        statusInput.value = lead.status;

        document.querySelector("#leadForm button").textContent = "Update Lead";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load lead.");

    }

}



// ===============================
// DELETE LEAD
// ===============================

async function deleteLead(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {

        await fetch(`${apiUrl}/${id}`, {

            method: "DELETE"

        });

        loadLeads();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete lead.");

    }

}



// ===============================
// SEARCH + FILTER
// ===============================

function applyFilters() {

    const keyword = searchInput.value.toLowerCase();

    const status = filterStatus.value;

    const filtered = leads.filter((lead) => {

        const matchesSearch =

            lead.name.toLowerCase().includes(keyword) ||

            lead.company.toLowerCase().includes(keyword);

        const matchesStatus =

            status === "" ||

            lead.status === status;

        return matchesSearch && matchesStatus;

    });

    displayLeads(filtered);

}

searchInput.addEventListener(

    "keyup",

    applyFilters

);

filterStatus.addEventListener(

    "change",

    applyFilters

);

// ===============================
// DASHBOARD
// ===============================

function updateDashboard(data) {

    totalLeads.textContent = data.length;

    newLeads.textContent = data.filter(
        lead => lead.status === "New"
    ).length;

    contactedLeads.textContent = data.filter(
        lead => lead.status === "Contacted"
    ).length;

    qualifiedLeads.textContent = data.filter(
        lead => lead.status === "Qualified"
    ).length;

    closedLeads.textContent = data.filter(
        lead => lead.status === "Closed"
    ).length;

}



// ===============================
// CLEAR FORM
// ===============================

function clearForm() {

    leadId.value = "";

    leadForm.reset();

    statusInput.value = "New";

    document.querySelector("#leadForm button").textContent = "Save Lead";

}



// ===============================
// PREVENT SEARCH FORM SUBMIT
// ===============================

searchInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

    }

});



// ===============================
// AUTO REFRESH
// ===============================

setInterval(() => {

    loadLeads();

}, 10000);



// ===============================
// INITIALIZE
// ===============================

statusInput.value = "New";

clearForm();

loadLeads();