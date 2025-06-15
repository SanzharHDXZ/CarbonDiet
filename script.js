const foodDatabase = [
    { name: "Beef (grain-fed)", category: "Meat", co2PerKg: 27.0 },
    { name: "Lamb", category: "Meat", co2PerKg: 39.2 },
    { name: "Pork", category: "Meat", co2PerKg: 12.1 },
    { name: "Chicken", category: "Meat", co2PerKg: 6.9 },
    { name: "Turkey", category: "Meat", co2PerKg: 10.9 },
    { name: "Salmon (farmed)", category: "Seafood", co2PerKg: 11.9 },
    { name: "Tuna", category: "Seafood", co2PerKg: 6.1 },
    { name: "Shrimp (farmed)", category: "Seafood", co2PerKg: 11.8 },
    { name: "Eggs", category: "Dairy & Eggs", co2PerKg: 4.2 },
    { name: "Milk", category: "Dairy & Eggs", co2PerKg: 3.2 },
    { name: "Cheese", category: "Dairy & Eggs", co2PerKg: 13.5 },
    { name: "Yogurt", category: "Dairy & Eggs", co2PerKg: 2.2 },
    { name: "Rice", category: "Grains", co2PerKg: 4.0 },
    { name: "Wheat (bread)", category: "Grains", co2PerKg: 1.4 },
    { name: "Oats", category: "Grains", co2PerKg: 1.6 },
    { name: "Quinoa", category: "Grains", co2PerKg: 2.1 },
    { name: "Pasta", category: "Grains", co2PerKg: 1.5 },
    { name: "Potatoes", category: "Vegetables", co2PerKg: 0.3 },
    { name: "Tomatoes", category: "Vegetables", co2PerKg: 1.4 },
    { name: "Broccoli", category: "Vegetables", co2PerKg: 0.4 },
    { name: "Spinach", category: "Vegetables", co2PerKg: 0.3 },
    { name: "Carrots", category: "Vegetables", co2PerKg: 0.2 },
    { name: "Onions", category: "Vegetables", co2PerKg: 0.3 },
    { name: "Bananas", category: "Fruits", co2PerKg: 0.7 },
    { name: "Apples", category: "Fruits", co2PerKg: 0.4 },
    { name: "Oranges", category: "Fruits", co2PerKg: 0.3 },
    { name: "Berries", category: "Fruits", co2PerKg: 1.1 },
    { name: "Avocados", category: "Fruits", co2PerKg: 2.5 },
    { name: "Tofu", category: "Plant Protein", co2PerKg: 2.0 },
    { name: "Beans", category: "Plant Protein", co2PerKg: 0.8 },
    { name: "Lentils", category: "Plant Protein", co2PerKg: 0.9 },
    { name: "Chickpeas", category: "Plant Protein", co2PerKg: 0.7 },
    { name: "Nuts (mixed)", category: "Plant Protein", co2PerKg: 2.3 },
    { name: "Chocolate", category: "Snacks", co2PerKg: 18.7 },
    { name: "Coffee", category: "Beverages", co2PerKg: 16.5 },
    { name: "Beer", category: "Beverages", co2PerKg: 1.1 },
    { name: "Wine", category: "Beverages", co2PerKg: 2.4 }
];

// Current food items in the log
let foodItems = [];

// Initialize the page
document.addEventListener("DOMContentLoaded", function() {
    // Populate food select
    populateFoodSelect();
    
    // Add event listeners
    document.getElementById("add-food").addEventListener("click", addFoodItem);
    document.getElementById("clear-all").addEventListener("click", clearAllFoodItems);
    document.getElementById("compare-foods").addEventListener("click", compareFoods);
    document.getElementById("dark-mode-toggle").addEventListener("change", toggleDarkMode);
    
    // Tab functionality
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
            document.getElementById(`${tab.getAttribute("data-tab")}-content`).classList.add("active");
        });
    });
    
    // Category filtering
    document.querySelectorAll(".category-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".category-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            filterFoodsByCategory(chip.getAttribute("data-category"));
        });
    });
    
    // Food search functionality
    document.getElementById("food-search").addEventListener("input", filterFoodsBySearch);
    
    // Initialize charts
    initializeCharts();
    
    // Load any saved meals
    document.getElementById("add-saved-meal").addEventListener("click", addSavedMeal);
    document.getElementById("save-meal").addEventListener("click", saveCurrentMeal);
    
    // Show recommendations
    showRecommendations();
});

function populateFoodSelect() {
    const foodSelect = document.getElementById("food-select");
    const compareFood1 = document.getElementById("compare-food1");
    const compareFood2 = document.getElementById("compare-food2");
    
    // Clear existing options
    foodSelect.innerHTML = '<option value="">Choose an item</option>';
    compareFood1.innerHTML = '<option value="">Select first food</option>';
    compareFood2.innerHTML = '<option value="">Select second food</option>';
    
    // Add food options
    foodDatabase.forEach((food, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = food.name;
        
        const compareOption1 = option.cloneNode(true);
        const compareOption2 = option.cloneNode(true);
        
        foodSelect.appendChild(option);
        compareFood1.appendChild(compareOption1);
        compareFood2.appendChild(compareOption2);
    });
}

function filterFoodsByCategory(category) {
    const foodSelect = document.getElementById("food-select");
    
    // Clear existing options
    foodSelect.innerHTML = '<option value="">Choose an item</option>';
    
    // Filter and add food options
    foodDatabase.forEach((food, index) => {
        if (category === "all" || food.category === category) {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = food.name;
            foodSelect.appendChild(option);
        }
    });
}

function filterFoodsBySearch() {
    const searchTerm = document.getElementById("food-search").value.toLowerCase();
    const foodSelect = document.getElementById("food-select");
    
    // Clear existing options
    foodSelect.innerHTML = '<option value="">Choose an item</option>';
    
    // Filter and add food options
    foodDatabase.forEach((food, index) => {
        if (food.name.toLowerCase().includes(searchTerm) || food.category.toLowerCase().includes(searchTerm)) {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = food.name;
            foodSelect.appendChild(option);
        }
    });
}

function addFoodItem() {
    const foodSelect = document.getElementById("food-select");
    const quantity = document.getElementById("quantity");
    const mealTime = document.getElementById("meal-time");
    
    if (foodSelect.value === "") {
        alert("Please select a food item");
        return;
    }
    
    const selectedFood = foodDatabase[foodSelect.value];
    const quantityValue = parseFloat(quantity.value);
    
    if (isNaN(quantityValue) || quantityValue <= 0) {
        alert("Please enter a valid quantity");
        return;
    }
    
    const co2Value = (selectedFood.co2PerKg * quantityValue / 1000).toFixed(2);
    
    const foodItem = {
        name: selectedFood.name,
        category: selectedFood.category,
        quantity: quantityValue,
        co2: parseFloat(co2Value),
        meal: mealTime.value
    };
    
    foodItems.push(foodItem);
    
    // Update UI
    updateFoodList();
    updateTotalCO2();
    updateCharts();
    showRecommendations();
    
    // Reset input fields
    foodSelect.value = "";
    quantity.value = "100";
}

function getImpactLevel(co2) {
    if (co2 > 1.0) {
        return "high";
    } else if (co2 > 0.5) {
        return "medium";
    } else {
        return "low";
    }
}

function updateFoodList() {
    const foodList = document.getElementById("food-list");
    foodList.innerHTML = "";
    
    if (foodItems.length === 0) {
        foodList.innerHTML = "<p>No items added yet. Add your first food item above!</p>";
        return;
    }
    
    foodItems.forEach((item, index) => {
        const impactLevel = getImpactLevel(item.co2);
        
        const li = document.createElement("li");
        li.className = "food-item";
        
        li.innerHTML = `
            <div class="food-info">
                <div class="food-name">${item.name} <span class="badge badge-${impactLevel}">${impactLevel}</span></div>
                <div class="food-meta">
                    <div class="food-co2 ${impactLevel}-impact">${item.co2} kg CO₂</div>
                    <div class="food-quantity">${item.quantity}g</div>
                    <div>${item.meal}</div>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        
        foodList.appendChild(li);
    });
    
    // Add remove event listeners
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"));
            removeFoodItem(index);
        });
    });
}

function removeFoodItem(index) {
    foodItems.splice(index, 1);
    updateFoodList();
    updateTotalCO2();
    updateCharts();
    showRecommendations();
}

function clearAllFoodItems() {
    if (confirm("Are you sure you want to clear all items?")) {
        foodItems = [];
        updateFoodList();
        updateTotalCO2();
        updateCharts();
        showRecommendations();
    }
}

function updateTotalCO2() {
    const totalCO2 = foodItems.reduce((total, item) => total + item.co2, 0);
    document.getElementById("co2-total").textContent = totalCO2.toFixed(2);
    
    // Update driving equivalent
    const drivingMiles = Math.round(totalCO2 * 2.5);
    document.getElementById("driving-equivalent").textContent = drivingMiles;
    
    // Update progress bar
    const dailyGoal = 3.0; // kg CO2
    const progressPercent = (totalCO2 / dailyGoal) * 100;
    const progressBar = document.getElementById("goal-progress-bar");
    
    progressBar.style.width = Math.min(progressPercent, 100) + "%";
    
    if (progressPercent >= 100) {
        progressBar.className = "progress-bar danger";
    } else if (progressPercent >= 75) {
        progressBar.className = "progress-bar warning";
    } else {
        progressBar.className = "progress-bar";
    }
}

function initializeCharts() {
    // Set up empty charts - will be populated in updateCharts()
    const categoryCtx = document.getElementById("category-chart").getContext("2d");
    const trendCtx = document.getElementById("trend-chart").getContext("2d");
    const comparisonCtx = document.getElementById("comparison-chart").getContext("2d");
    
    // Placeholder data
    window.categoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    window.trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'CO₂ (kg)',
                data: [2.3, 2.5, 1.9, 2.1, 0, 0, 0],
                borderColor: '#4CAF50',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    window.comparisonChart = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'CO₂ per kg',
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kg CO₂ per kg of food'
                    }
                }
            }
        }
    });
}

function updateCharts() {
    // Group items by category and calculate total CO2 for each category
    const categoryData = {};
    
    foodItems.forEach(item => {
        if (!categoryData[item.category]) {
            categoryData[item.category] = 0;
        }
        categoryData[item.category] += item.co2;
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    // Colors for categories
    const colors = [
        '#4CAF50', '#FF5722', '#2196F3', '#FFC107', 
        '#9C27B0', '#795548', '#607D8B', '#E91E63'
    ];
    
    // Update the category chart
    window.categoryChart.data.labels = labels;
    window.categoryChart.data.datasets[0].data = data;
    window.categoryChart.data.datasets[0].backgroundColor = labels.map((_, i) => colors[i % colors.length]);
    window.categoryChart.update();
    
    // Update for today's data in the trend chart
    const today = new Date().getDay();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = weekDays.indexOf(weekDays[today]);
    
    const totalCO2 = foodItems.reduce((total, item) => total + item.co2, 0);
    window.trendChart.data.datasets[0].data[todayIndex] = totalCO2;
    window.trendChart.update();
}

function compareFoods() {
    const compareFood1 = document.getElementById("compare-food1").value;
    const compareFood2 = document.getElementById("compare-food2").value;
    
    if (compareFood1 === "" || compareFood2 === "") {
        alert("Please select two foods to compare");
        return;
    }
    
    const food1 = foodDatabase[compareFood1];
    const food2 = foodDatabase[compareFood2];
    
    // Update the comparison chart
    window.comparisonChart.data.labels = [food1.name, food2.name];
    window.comparisonChart.data.datasets[0].data = [food1.co2PerKg, food2.co2PerKg];
    
    // Determine colors based on impact level
    window.comparisonChart.data.datasets[0].backgroundColor = [
        getImpactColor(food1.co2PerKg),
        getImpactColor(food2.co2PerKg)
    ];
    
    window.comparisonChart.update();
}

function getImpactColor(co2) {
    if (co2 > 10) {
        return '#F44336'; // High impact (red)
    } else if (co2 > 5) {
        return '#FFC107'; // Medium impact (yellow)
    } else {
        return '#4CAF50'; // Low impact (green)
    }
}

function showRecommendations() {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = "";
    
    // Check if there are any high-impact foods
    const highImpactFoods = foodItems.filter(item => item.co2 > 1.0);
    
    if (highImpactFoods.length > 0) {
        // Sort by impact (highest first)
        highImpactFoods.sort((a, b) => b.co2 - a.co2);
        
        // Get the highest impact food
        const highestImpactFood = highImpactFoods[0];
        
        // Find lower impact alternatives in the same category
        const alternatives = foodDatabase.filter(food => 
            food.category === highestImpactFood.category && 
            food.co2PerKg < foodDatabase.find(f => f.name === highestImpactFood.name).co2PerKg
        );
        
        if (alternatives.length > 0) {
            // Sort alternatives by CO2 (lowest first)
            alternatives.sort((a, b) => a.co2PerKg - b.co2PerKg);
            
            // Create recommendation
            const bestAlternative = alternatives[0];
            const savedCO2 = (
                (foodDatabase.find(f => f.name === highestImpactFood.name).co2PerKg - bestAlternative.co2PerKg) * 
                highestImpactFood.quantity / 1000
            ).toFixed(2);
            
            const recommendation = document.createElement("div");
            recommendation.className = "recommendation-item";
            recommendation.innerHTML = `
                <div class="recommendation-icon">🔄</div>
                <div>
                    <strong>Try ${bestAlternative.name} instead of ${highestImpactFood.name}</strong>
                    <p>This swap could save you ${savedCO2} kg of CO₂, which is a ${
                        Math.round((savedCO2 / highestImpactFood.co2) * 100)
                    }% reduction for this item.</p>
                </div>
            `;
            
            recommendationsDiv.appendChild(recommendation);
        }
    }
    
    // Add general recommendations
    const generalRecommendation = document.createElement("div");
    generalRecommendation.className = "recommendation-item";
    generalRecommendation.innerHTML = `
        <div class="recommendation-icon">📊</div>
        <div>
            <strong>Meal Planning Tip</strong>
            <p>Planning your meals ahead reduces food waste, which accounts for about 8% of global greenhouse gas emissions.</p>
        </div>
    `;
    
    recommendationsDiv.appendChild(generalRecommendation);
    
    const seasonalRecommendation = document.createElement("div");
    seasonalRecommendation.className = "recommendation-item";
    seasonalRecommendation.innerHTML = `
        <div class="recommendation-icon">🍎</div>
        <div>
            <strong>Eat Seasonal</strong>
            <p>Choosing seasonal foods reduces energy used for greenhouse growing and long-distance transportation.</p>
        </div>
    `;
    
    recommendationsDiv.appendChild(seasonalRecommendation);
}

function addSavedMeal() {
    const savedMeals = document.getElementById("saved-meals").value;
    
    if (savedMeals === "") {
        alert("Please select a saved meal");
        return;
    }
    
    // In a real app, these would be loaded from storage
    const meals = {
        "vegetarian-breakfast": [
            { name: "Oats", category: "Grains", quantity: 80, co2: 0.128, meal: "breakfast" },
            { name: "Milk", category: "Dairy & Eggs", quantity: 200, co2: 0.64, meal: "breakfast" },
            { name: "Bananas", category: "Fruits", quantity: 120, co2: 0.084, meal: "breakfast" }
        ],
        "protein-lunch": [
            { name: "Chicken", category: "Meat", quantity: 150, co2: 1.035, meal: "lunch" },
            { name: "Rice", category: "Grains", quantity: 100, co2: 0.4, meal: "lunch" },
            { name: "Broccoli", category: "Vegetables", quantity: 100, co2: 0.04, meal: "lunch" }
        ],
        "salad-dinner": [
            { name: "Spinach", category: "Vegetables", quantity: 100, co2: 0.03, meal: "dinner" },
            { name: "Tomatoes", category: "Vegetables", quantity: 100, co2: 0.14, meal: "dinner" },
            { name: "Chickpeas", category: "Plant Protein", quantity: 100, co2: 0.07, meal: "dinner" },
            { name: "Feta Cheese", category: "Dairy & Eggs", quantity: 50, co2: 0.675, meal: "dinner" }
        ]
    };
    
    // Add all items from the selected meal
    meals[savedMeals].forEach(item => {
        foodItems.push(item);
    });
    
    // Update UI
    updateFoodList();
    updateTotalCO2();
    updateCharts();
    showRecommendations();
    
    alert("Meal added to your food log!");
}

function saveCurrentMeal() {
    const mealName = document.getElementById("meal-name").value;
    
    if (mealName === "") {
        alert("Please enter a name for your meal");
        return;
    }
    
    if (foodItems.length === 0) {
        alert("Please add some food items first");
        return;
    }
    
    // In a real app, this would save to storage
    alert(`Meal "${mealName}" saved successfully!`);
    
    // Reset field
    document.getElementById("meal-name").value = "";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}