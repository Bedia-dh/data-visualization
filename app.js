// Language Data
const languages = {
  fr: {
    title: "Tableau de Bord des Municipalités",
    governorateLabel: "Sélectionner Gouvernorat",
    barChartTitle: "Répartition du Personnel par Municipalité",
    lineChartTitle: "Tendances de la Population par Municipalité",
    pieChartTitle: "Ratio du Personnel par Municipalité",
    footerText: "Tableau de Bord des Municipalités | Alimenté par la Visualisation des Données",
    chooseGovernorate: "Choisissez un Gouvernorat"
  },
  ar: {
    title: "لوحة بيانات البلديات",
    governorateLabel: "اختر المحافظة",
    barChartTitle: "توزيع الموظفين حسب البلدية",
    lineChartTitle: "اتجاهات السكان حسب البلدية",
    pieChartTitle: "نسبة الموظفين حسب البلدية",
    footerText: "لوحة بيانات البلديات | مدعوم من تصور البيانات",
    chooseGovernorate: "اختر محافظة"
  }
};

// Governorates Data
const governorates = {
  fr: [
    "Ariana", "Béja", "Ben_Arous", "Bizerte", "Gabès", "Gafsa", 
    "Jendouba", "Kairouan", "Kasserine", "Kébili", "El_Kef", 
    "Mahdia", "Manouba", "Médenine", "Monastir", "Nabeul", 
    "Sfax", "Sidi_Bouzid", "Siliana", "Sousse", "Tataouine", 
    "Tozeur", "Tunis", "Zaghouan"
  ],
  ar: [
    "أريانة", "باجة", "بن عروس", "بنزرت", "قابس", "قفصة", 
    "جندوبة", "القيروان", "القصرين", "قبلي", "الكاف", 
    "المهدية", "منوبة", "مدنين", "المنستير", "نابل", 
    "صفاقس", "سيدي بوزيد", "سليانة", "سوسة", "تطاوين", 
    "توزر", "تونس", "زغوان"
  ]
};

// Sample Data organized by Governorate
document.getElementById('loadDataBtn').addEventListener('click', async () => {
  try {
      // Fetch processed data from Flask backend
      const response = await fetch('/get-data');
      const data = await response.json();

      if (response.ok) {
          // Display data in output container
          const outputContainer = document.getElementById('output');
          outputContainer.textContent = JSON.stringify(data, null, 2);

          // Update charts with the fetched data
          updateCharts(data);
      } else {
          alert(data.error || 'Failed to load data');
      }
  } catch (error) {
      console.error('Error fetching data:', error);
      alert('An error occurred while fetching data.');
  }
});

// Function to update charts with new data
function updateCharts(data) {
  console.log('Data received for chart:', data);

  // Example: Plotly.js chart update
  const chartDiv = document.getElementById('chart');
  const chartData = [
      {
          x: data.x_values,  // Replace with actual keys from your backend response
          y: data.y_values,
          type: 'bar',
      },
  ];

  Plotly.newPlot(chartDiv, chartData);
}


// Initialize Language Selection
const languageSelect = document.getElementById("language-select");

// Populate Governorate Dropdown
function populateGovernorateDropdown(language = "fr") {
  const governorateDropdown = document.getElementById("governorate-dropdown");
  governorateDropdown.innerHTML = ""; // Clear existing options

  // Add default "Choose Governorate" option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = languages[language].chooseGovernorate;
  defaultOption.value = "";
  governorateDropdown.appendChild(defaultOption);

  // Add governorates based on selected language
  governorates[language].forEach(governorate => {
    const option = document.createElement("option");
    option.textContent = governorate;
    option.value = governorate;
    governorateDropdown.appendChild(option);
  });
}

// Update Page Language
function updateLanguage(language) {
  const lang = languages[language];

  // Update Texts
  document.getElementById("title").innerText = lang.title;
  document.getElementById("governorate-label").innerText = lang.governorateLabel;
  document.getElementById("footer-text").innerText = lang.footerText;

  // Update Dropdown
  populateGovernorateDropdown(language);

  // Re-render charts if a governorate is selected
  const selectedGovernorate = document.getElementById("governorate-dropdown").value;
  if (selectedGovernorate) {
    renderCharts(selectedGovernorate);
  }
}

// Initialize default language (French)
updateLanguage("fr");

// Event Listener for Language Change
languageSelect.addEventListener("change", (event) => {
  updateLanguage(event.target.value);
});

// Fetch Data and Render Charts for Selected Governorate
function renderCharts(governorate) {
  let governorateKey = governorate;

  // Handle Arabic translations for data keys
  if (languageSelect.value === "ar") {
    const index = governorates.ar.indexOf(governorate);
    governorateKey = index !== -1 ? governorates.fr[index] : "";
  }

  const chartData = data[governorateKey];
  const lang = languages[languageSelect.value];

  if (!chartData) {
    alert(lang.chooseGovernorate);
    return;
  }

  // Bar Chart - Senior Staff Distribution
  const barChartData = {
    x: chartData.map(item => item.Municipality_Name),
    y: chartData.map(item => item.Senior_Staff),
    type: "bar",
    name: lang.barChartTitle
  };

  const barChartLayout = {
    title: lang.barChartTitle,
    xaxis: { title: lang.governorateLabel },
    yaxis: { title: "Nombre de Personnes" }
  };

  Plotly.newPlot("bar-chart", [barChartData], barChartLayout);

  // Line Chart - Population Trends
  const lineChartData = {
    x: chartData.map(item => item.Municipality_Name),
    y: chartData.map(item => item.Population),
    mode: "lines+markers",
    name: lang.lineChartTitle
  };

  const lineChartLayout = {
    title: lang.lineChartTitle,
    xaxis: { title: lang.governorateLabel },
    yaxis: { title: "Population" }
  };

  Plotly.newPlot("line-chart", [lineChartData], lineChartLayout);

  // Pie Chart - Staff Ratio Distribution
  const pieChartData = {
    labels: chartData.map(item => item.Municipality_Name),
    values: chartData.map(item => item.Staff_Ratio),
    type: "pie"
  };

  const pieChartLayout = {
    title: lang.pieChartTitle
  };

  Plotly.newPlot("pie-chart", [pieChartData], pieChartLayout);
}

// Event Listener for Governorate Selection
document.getElementById("governorate-dropdown").addEventListener("change", function() {
  const selectedGovernorate = this.value;
  if (selectedGovernorate) {
    renderCharts(selectedGovernorate);
  }
});
