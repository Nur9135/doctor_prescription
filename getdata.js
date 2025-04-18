// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8-09yv6Y4GoJsRGjFVa8L8iyOV8oFA7o",
  authDomain: "doctor-prescription-09135.firebaseapp.com",
  projectId: "doctor-prescription-09135",
  storageBucket: "doctor-prescription-09135.appspot.com",
  messagingSenderId: "404658459529",
  appId: "1:404658459529:web:30be5567bf9a90dc41c758"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);








// Fetch and render symptoms
const fetchAndRenderSymptoms = async () => {
  const snapshot = await getDocs(collection(db, 'symptoms'));
  const symptomList = snapshot.docs.map(doc => doc.data().name);

  const container = document.getElementById("checkboxContainer");

  symptomList.forEach(symptom => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "symptom";
    checkbox.value = symptom;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + symptom));
    container.appendChild(label);
  });
};

fetchAndRenderSymptoms()


const categoryFilter = document.getElementById("categoryFilter");
const diseaseContainer = document.getElementById("diseaseCheckboxes");
const diseaseFilter = document.getElementById("diseaseFilter");
const medicineFilter = document.getElementById("medicineFilter"); // Medicine filter dropdown

// Function to fetch diagnosis data from Firestore
const fetchDiagnosisData = async () => {
  const snapshot = await getDocs(collection(db, 'medicines'));
  const allDiagnosis = {};

  snapshot.docs.forEach(doc => {
    const categoryId = doc.id;
    const diseases = doc.data();
    allDiagnosis[categoryId] = diseases;

    // Add category to dropdown
    const option = document.createElement("option");
    option.value = categoryId;
    option.textContent = categoryId.replaceAll("_", " ");
    categoryFilter.appendChild(option);
  });

  // Event listener for category selection
  categoryFilter.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;

    // Clear old checkboxes and dropdown options
    diseaseContainer.innerHTML = "";
    diseaseFilter.innerHTML = `<option value="">-- Select Disease --</option>`;
    medicineFilter.innerHTML = `<option value="">-- Select Medicine --</option>`; // Clear medicines

    if (selectedCategory && allDiagnosis[selectedCategory]) {
      const diseasesInCategory = Object.keys(allDiagnosis[selectedCategory]);

      // Add disease checkboxes
      diseasesInCategory.forEach(disease => {
        const label = document.createElement("label");
        label.style.display = "inline-block";
        label.style.width = "45%"; // Column style
        label.style.margin = "5px 0";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "disease";
        checkbox.value = disease;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + disease));
        diseaseContainer.appendChild(label);
      });

      // Add diseases to disease dropdown
      diseasesInCategory.forEach(disease => {
        const option = document.createElement("option");
        option.value = disease;
        option.textContent = disease;
        diseaseFilter.appendChild(option);
      });
    }
  });

  diseaseFilter.addEventListener("change", (e) => {
    const selectedCategory = categoryFilter.value;
    const selectedDisease = e.target.value;

    console.log("Selected Category:", selectedCategory);
    console.log("Selected Disease:", selectedDisease);

    medicineFilter.innerHTML = "<option value=''>-- Select Medicine --</option>";

    const medicines = allDiagnosis[selectedCategory]?.[selectedDisease] || [];

    if (Array.isArray(medicines)) {
      medicines.forEach(med => {
        const option = document.createElement("option");
        option.value = med.name;
        option.textContent = `${med.name} (${med.composition})`;
        medicineFilter.appendChild(option);
      });
    } else {
      console.log("No medicine array found for selected disease");
    }
  });
};

// Call the fetchDiagnosisData function to initialize the category and disease dropdowns
fetchDiagnosisData();


// 🔹 Fetch Common Tests
export const fetchTests = async () => {
  const snapshot = await getDocs(collection(db, 'common_test'));
  const list = snapshot.docs.map(doc => doc.data().name);

  return list;
};

// Call this function to populate the checkbox list
const populateTestCheckboxes = async () => {
  const testList = await fetchTests();
  const container = document.getElementById('testContainer');

  testList.forEach(test => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'tests';
    checkbox.value = test;
    checkbox.id = `test-${test}`;

    const label = document.createElement('label');
    label.htmlFor = `test-${test}`;
    label.textContent = test;

    const wrapper = document.createElement('div');
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    container.appendChild(wrapper);
  });
};

// Run this on page load or whenever appropriate
populateTestCheckboxes();


export function getAllSelectedData() {
  // 1. Patient Details
  const patientName = document.getElementById('patientName').value || 'N/A';
  const patientAge = document.getElementById('patientAge').value || 'N/A';
  const patientGender = document.querySelector('input[name="gender"]:checked')?.value || 'N/A';


  // 2. Selected Symptoms
  const selectedSymptoms = [];
  const symptomsCheckboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
  symptomsCheckboxes.forEach(checkbox => {
    selectedSymptoms.push(checkbox.value);
  });

  // 3. Common Tests
  const selectedTests = [];
  const testCheckboxes = document.querySelectorAll('#testContainer input[type="checkbox"]:checked');
  testCheckboxes.forEach(cb => selectedTests.push(cb.value));

  // 4. Diagnosis
  const category = document.getElementById('categoryFilter').value || 'N/A';
  const selectedDiseases = [];
  const diseaseCheckboxes = document.querySelectorAll('#diseaseCheckboxes input[type="checkbox"]:checked');
  diseaseCheckboxes.forEach(cb => selectedDiseases.push(cb.value));

  // 5. Medicines
   
  const medicinesList = selectedMedicines.map(med => {
    return {
      name: med.name,
      dosage: med.dosage,
      composition: med.composition || 'N/A',  // Add composition here
      days: med.days
    };
  });

  // Collecting all data into an object
  const allData = {
    patient: {
      name: patientName,
      age: patientAge,
      gender: patientGender
    },
    symptoms: selectedSymptoms,
    diagnosis: {
      category: category,
      diseases: selectedDiseases.length ? selectedDiseases : ['N/A']
    },
    medicines: medicinesList,
    tests: selectedTests,
  };

  // Open a new window with the advanced HTML content
  const newWindow = window.open('', '_blank',);
  newWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Prescription Layout</title>
<link rel="stylesheet" href="style.css">
<style>
   body {
  margin: 150px 0 0 0; /* Top, Right, Bottom, Left */
}
</style>
</head>
<body>
<hr>
<div class="prescription-container">
<h3>Prescription</h3>
  <br>
  <!-- Row 1: 3 Columns (Name, Age, Gender) -->
  <div class="row row-3-cols">
    <div class="col inline-pair">
      <strong>Patient Name:</strong>
      <p>${allData.patient.name}</p>
    </div>
    <div class="col inline-pair">
      <strong>Age:</strong>
      <p>${allData.patient.age}</p>
    </div>
    <div class="col inline-pair">
      <strong>Gender:</strong>
      <p>${allData.patient.gender}</p>
    </div>

    <div class="col inline-pair">
  <strong>Date & Time:</strong>
  <p id="currentDateTimeDisplay"></p>
</div>

  </div>

  <!-- Row 2: 2 Columns (Symptoms and Tests) -->
  <div class="row row-2-cols">
 <div class="col">
      <div class="section-block">
          <h3>Symptoms</h3>
          <ul class="styled-list">
          ${allData.symptoms.length > 0
      ? allData.symptoms.map(symptom => `<li>${symptom}</li>`).join('')
      : '<li>N/A</li>'}
          </ul>
      </div>

      <div class="section-block">
          <h3>Diagnosis</h3>
          <ul class="styled-list">
          ${allData.diagnosis.diseases.length > 0
      ? allData.diagnosis.diseases.map(disease => `<li>${disease}</li>`).join('')
      : '<li>N/A</li>'}
          </ul>
      </div>
      </div>

    <div class="col">
      <h3>Tests</h3>
      <ul class="styled-list">
        ${allData.tests.length > 0 ? allData.tests.map(test => `<li>${test}</li>`).join('') : '<li>N/A</li>'}
      </ul>
    </div>
  </div>

  <!-- Row 3: Full-width Medicines Table -->
  <div class="row row1">
    <h3>Medicines</h3>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Medicine Name</th>
          <th>Dosage</th>
          <th>Duration (Days)</th>
        </tr>
      </thead>
      <tbody>
        ${allData.medicines.length > 0 ? allData.medicines.map(med => `
          <tr>
           <td>
                ${med.name}  
               
                <small style="font-size: 10px;">(${med.composition})</small>
              </td>

            <td>${med.dosage}</td>
            <td>${med.days}</td>
          </tr>
        `).join('') : '<tr><td colspan="3">No Medicines</td></tr>'}
      </tbody>
    </table>
  </div>

</div>
<script>
   
    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }); // Example: "18/04/2025, 02:45 PM"
  console.log(formattedDateTime)
    document.getElementById("currentDateTimeDisplay").textContent = formattedDateTime;

  
</script>
</body>
</html>


  `);
  console.log(allData);

  return allData;
}



let selectedMedicines = []; // <- define this globally

export function addMedicine() {
  const medSelect = document.getElementById('medicineFilter');
  const name = document.getElementById('medicineFilter').value;
  const dosage = document.getElementById('dosage').value;
  const days = document.getElementById('days').value;

  const selectedOption = medSelect.selectedOptions[0];
  const fullText = selectedOption?.textContent || '';
  const composition = fullText.replace(name, '').replace(/[()]/g, '').trim(); // extract composition from text


  if (!name || !dosage || !days) {
    alert("Please fill all medicine fields.");
    return;
  }

  selectedMedicines.push({ name, composition, dosage, days });


  document.getElementById('medicineFilter').value = '';
  document.getElementById('days').value = '';

  updateMedicineList();
}

export function updateMedicineList() {
  const listDiv = document.getElementById('medicineList');

  if (!selectedMedicines.length) {
    listDiv.innerHTML = `<p class="no-meds">No medicines added yet.</p>`;
    return;
  }

  listDiv.innerHTML = `
    <h3 class="med-heading">Medicines Added</h3>
    <hr>
    <ul class="medicine-list">
      ${selectedMedicines
        .map(
          (m, index) => `
        <li class="medicine-item">
          <div>
            <span class="pill-detail">${m.name} (${m.composition}) - ${m.dosage} for ${m.days} days</span>
          </div>
          <button class="delete-btn" onclick="removeMedicine(${index})">×</button>
        </li>`
        )
        .join("")}
    </ul>
  `;
}

// ✅ Move this function to global scope so it’s accessible from inline onclick
window.removeMedicine = function(index) {
  selectedMedicines.splice(index, 1);
  updateMedicineList();
};


export const selectedDiseasesGlobal = new Set(); // ⬅️ stores checked diseases across categories
