// GET ELEMENTS 

const expenseForm =
    document.getElementById("expenseForm");

const expenseName =
    document.getElementById("expenseName");

const expenseAmount =
    document.getElementById("expenseAmount");

const expenseCategory =
    document.getElementById("expenseCategory");

const expenseMood =
    document.getElementById("expenseMood");

const expenseList =
    document.getElementById("expenseList");

const searchInput =
    document.getElementById("searchInput");

const filterCategory =
    document.getElementById("filterCategory");

const filterMood =
    document.getElementById("filterMood");

const totalSpent =
    document.getElementById("totalSpent");

const expenseCount =
    document.getElementById("expenseCount");

const averageSpent =
    document.getElementById("averageSpent");

const themeBtn =
    document.getElementById("themeBtn");

const sortBtn =
    document.getElementById("sortBtn");



// DATA 

let expenses =
    JSON.parse(
        localStorage.getItem("expenseTrackerV4")
    ) || [];

let budget =
    Number(
        localStorage.getItem("expenseBudgetV4")
    ) || 0;

let savingsGoal =
    Number(
        localStorage.getItem("expenseGoalV4")
    ) || 0;

let sortNewest = true;

let expenseChart = null;


// SAVE DATA

function saveExpenses() {

    localStorage.setItem(
        "expenseTrackerV4",
        JSON.stringify(expenses)
    );
}


// ADD EXPENSE

expenseForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            expenseName.value.trim();

        const amount =
            Number(expenseAmount.value);

        const category =
            expenseCategory.value;

        const mood =
            expenseMood.value;


        if (
            name === "" ||
            amount <= 0
        ) {

            showToast(
                "Please enter valid expense details."
            );

            return;
        }


        const expense = {

            id: Date.now(),

            name: name,

            amount: amount,

            category: category,

            mood: mood,

            date: new Date().toISOString()

        };


        expenses.push(expense);

        saveExpenses();

        expenseForm.reset();

        updateDashboard();

        displayExpenses();

        showToast(
            "Expense added successfully! ✅"
        );

    }
);


// DISPLAY EXPENSES

function displayExpenses() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        filterCategory.value;

    const selectedMood =
        filterMood.value;


    let filteredExpenses =
        expenses.filter(function (expense) {

            const matchesSearch =
                expense.name
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                expense.category === selectedCategory;

            const matchesMood =
                selectedMood === "All" ||
                expense.mood === selectedMood;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesMood
            );

        });


    if (sortNewest) {

        filteredExpenses.sort(
            function (a, b) {
                return b.id - a.id;
            }
        );

    }

    else {

        filteredExpenses.sort(
            function (a, b) {
                return a.amount - b.amount;
            }
        );

    }


    expenseList.innerHTML = "";


    const emptyMessage =
        document.getElementById("emptyMessage");


    if (filteredExpenses.length === 0) {

        emptyMessage.style.display = "block";

    }

    else {

        emptyMessage.style.display = "none";

    }


    filteredExpenses.forEach(
        function (expense) {

            const expenseItem =
                document.createElement("div");

            expenseItem.className =
                "expense-item";


            const date =
                new Date(expense.date);


            const formattedDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            expenseItem.innerHTML = `

                <div class="expense-info">

                    <div class="expense-name">
                        ${escapeHTML(expense.name)}
                    </div>

                    <div class="expense-amount">
                        ₹${expense.amount}
                    </div>

                    <div class="expense-category">
                        ${expense.category}
                        • ${expense.mood}
                    </div>

                    <div class="expense-date">
                        📅 ${formattedDate}
                    </div>

                </div>


                <div class="expense-actions">

                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})">
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})">
                        🗑️ Delete
                    </button>

                </div>

            `;


            expenseList.appendChild(
                expenseItem
            );

        }
    );

}


// SEARCH + FILTER

searchInput.addEventListener(
    "input",
    displayExpenses
);

filterCategory.addEventListener(
    "change",
    displayExpenses
);

filterMood.addEventListener(
    "change",
    displayExpenses
);


// SORT

sortBtn.addEventListener(
    "click",
    function () {

        sortNewest =
            !sortNewest;


        if (sortNewest) {

            sortBtn.textContent =
                "↕ Sort: Newest";

        }

        else {

            sortBtn.textContent =
                "↕ Sort: Lowest Amount";

        }


        displayExpenses();

    }
);


// UPDATE SUMMARY

function updateSummary() {

    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },
            0
        );


    const count =
        expenses.length;


    const average =
        count === 0
            ? 0
            : total / count;


    totalSpent.textContent =
        Math.round(total);


    expenseCount.textContent =
        count;


    averageSpent.textContent =
        Math.round(average);

}


// DELETE

function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    expenses =
        expenses.filter(
            function (expense) {

                return expense.id !== id;

            }
        );


    saveExpenses();

    updateDashboard();

    displayExpenses();

    showToast(
        "Expense deleted successfully 🗑️"
    );

}


// EDIT

function editExpense(id) {

    const expense =
        expenses.find(
            function (expense) {

                return expense.id === id;

            }
        );


    if (!expense) {
        return;
    }


    const newName =
        prompt(
            "Enter expense name:",
            expense.name
        );


    if (newName === null) {
        return;
    }


    const newAmount =
        prompt(
            "Enter amount:",
            expense.amount
        );


    if (newAmount === null) {
        return;
    }


    const amount =
        Number(newAmount);


    if (
        newName.trim() === "" ||
        amount <= 0
    ) {

        showToast(
            "Please enter valid details."
        );

        return;
    }


    expense.name =
        newName.trim();

    expense.amount =
        amount;


    saveExpenses();

    updateDashboard();

    displayExpenses();

    showToast(
        "Expense updated successfully ✏️"
    );

}


// BUDGET

const budgetBtn =
    document.getElementById("budgetBtn");

budgetBtn.addEventListener(
    "click",
    function () {

        const value =
            prompt(
                "Enter your monthly budget:"
            );


        if (value === null) {
            return;
        }


        const amount =
            Number(value);


        if (amount <= 0) {

            showToast(
                "Please enter a valid budget."
            );

            return;
        }


        budget =
            amount;


        localStorage.setItem(
            "expenseBudgetV4",
            budget
        );


        updateDashboard();


        showToast(
            "Budget updated successfully 🎯"
        );

    }
);


// UPDATE BUDGET

function updateBudget() {

    const budgetAmount =
        document.getElementById("budgetAmount");

    const budgetProgress =
        document.getElementById("budgetProgress");

    const budgetMessage =
        document.getElementById("budgetMessage");


    budgetAmount.textContent =
        budget;


    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },
            0
        );


    if (budget === 0) {

        budgetProgress.style.width =
            "0%";

        budgetMessage.textContent =
            "Set a budget to track your spending.";

        return;

    }


    const percentage =
        Math.min(
            (total / budget) * 100,
            100
        );


    budgetProgress.style.width =
        percentage + "%";


    if (total > budget) {

        budgetMessage.textContent =
            "🚨 You have exceeded your budget.";

    }

    else if (percentage >= 80) {

        budgetMessage.textContent =
            "⚠️ You are close to your budget limit.";

    }

    else {

        budgetMessage.textContent =
            "✅ You are within your budget.";

    }

}


// SAVINGS GOAL

const goalBtn =
    document.getElementById("goalBtn");

goalBtn.addEventListener(
    "click",
    function () {

        const value =
            prompt(
                "Enter your savings goal:"
            );


        if (value === null) {
            return;
        }


        const amount =
            Number(value);


        if (amount <= 0) {

            showToast(
                "Please enter a valid savings goal."
            );

            return;
        }


        savingsGoal =
            amount;


        localStorage.setItem(
            "expenseGoalV4",
            savingsGoal
        );


        updateDashboard();


        showToast(
            "Savings goal updated 🎯"
        );

    }
);


// UPDATE SAVINGS

function updateSavingsGoal() {

    const goalAmount =
        document.getElementById("goalAmount");

    const savingsProgress =
        document.getElementById("savingsProgress");

    const savingsMessage =
        document.getElementById("savingsMessage");


    goalAmount.textContent =
        savingsGoal;


    if (savingsGoal === 0) {

        savingsProgress.style.width =
            "0%";

        savingsMessage.textContent =
            "Set a savings goal.";

        return;

    }


    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },
            0
        );


    const saved =
        Math.max(
            budget - total,
            0
        );


    const percentage =
        Math.min(
            (saved / savingsGoal) * 100,
            100
        );


    savingsProgress.style.width =
        percentage + "%";


    if (saved >= savingsGoal) {

        savingsMessage.textContent =
            "🎉 Savings goal reached!";

    }

    else {

        savingsMessage.textContent =
            `You have ₹${saved} available toward your goal.`;

    }

}


// SPENDING MOOD

function updateMood() {

    const moods = {

        Need: 0,
        Want: 0,
        Routine: 0,
        Emergency: 0

    };


    expenses.forEach(
        function (expense) {

            if (
                moods[expense.mood] !== undefined
            ) {

                moods[expense.mood]++;

            }

        }
    );


    document.getElementById(
        "needCount"
    ).textContent =
        moods.Need;


    document.getElementById(
        "wantCount"
    ).textContent =
        moods.Want;


    document.getElementById(
        "routineCount"
    ).textContent =
        moods.Routine;


    document.getElementById(
        "emergencyCount"
    ).textContent =
        moods.Emergency;


    let mood =
        "😊 Balanced";


    if (expenses.length > 0) {

        const moodArray =
            Object.entries(moods);


        moodArray.sort(
            function (a, b) {
                return b[1] - a[1];
            }
        );


        const topMood =
            moodArray[0][0];


        if (topMood === "Need") {

            mood =
                "💚 Responsible";

        }

        else if (topMood === "Want") {

            mood =
                "🛍️ Shopping Mood";

        }

        else if (topMood === "Emergency") {

            mood =
                "🚨 Emergency Spending";

        }

        else {

            mood =
                "🔄 Routine Spending";

        }

    }


    document.getElementById(
        "spendingMood"
    ).textContent =
        mood;

}


// SMART INSIGHTS

function showSpendingInsights() {

    const insightsBox =
        document.getElementById("insights");


    if (expenses.length === 0) {

        insightsBox.innerHTML =
            `<p class="empty-text">
                Add expenses to receive smart insights.
            </p>`;

        return;

    }


    const biggestExpense =
        expenses.reduce(
            function (max, expense) {

                return expense.amount > max.amount
                    ? expense
                    : max;

            },
            expenses[0]
        );


    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },
            0
        );


    const average =
        total / expenses.length;


    const categoryTotals = {};


    expenses.forEach(
        function (expense) {

            if (
                !categoryTotals[expense.category]
            ) {

                categoryTotals[expense.category] =
                    0;

            }


            categoryTotals[expense.category] +=
                expense.amount;

        }
    );


    let highestCategory =
        "";

    let highestCategoryAmount =
        0;


    for (
        const category in categoryTotals
    ) {

        if (
            categoryTotals[category] >
            highestCategoryAmount
        ) {

            highestCategoryAmount =
                categoryTotals[category];

            highestCategory =
                category;

        }

    }


    let budgetInsight =
        "Set a budget to understand your spending.";


    if (budget > 0) {

        const budgetPercentage =
            (total / budget) * 100;


        if (budgetPercentage > 100) {

            budgetInsight =
                "You have crossed your monthly budget.";

        }

        else if (budgetPercentage >= 80) {

            budgetInsight =
                "You are close to your monthly budget.";

        }

        else {

            budgetInsight =
                "Your spending is currently within budget.";

        }

    }


    insightsBox.innerHTML = `

        <div class="insight-card">

            <span>💸</span>

            <div>

                <small>Biggest Expense</small>

                <strong>
                    ${escapeHTML(biggestExpense.name)}
                    - ₹${biggestExpense.amount}
                </strong>

            </div>

        </div>


        <div class="insight-card">

            <span>🏆</span>

            <div>

                <small>Top Category</small>

                <strong>
                    ${highestCategory}
                    - ₹${highestCategoryAmount}
                </strong>

            </div>

        </div>


        <div class="insight-card">

            <span>📊</span>

            <div>

                <small>Average Expense</small>

                <strong>
                    ₹${Math.round(average)}
                </strong>

            </div>

        </div>


        <div class="insight-card">

            <span>🎯</span>

            <div>

                <small>Budget Status</small>

                <strong>
                    ${budgetInsight}
                </strong>

            </div>

        </div>

    `;

}


// CATEGORY BREAKDOWN

function showCategoryBreakdown() {

    const categoryBox =
        document.getElementById(
            "categoryBreakdown"
        );


    const categoryTotals = {};


    expenses.forEach(
        function (expense) {

            if (
                !categoryTotals[expense.category]
            ) {

                categoryTotals[expense.category] =
                    0;

            }


            categoryTotals[expense.category] +=
                expense.amount;

        }
    );


    categoryBox.innerHTML = "";


    if (expenses.length === 0) {

        categoryBox.innerHTML =
            `<p class="empty-text">
                No spending data yet.
            </p>`;

        return;

    }


    for (
        const category in categoryTotals
    ) {

        const amount =
            categoryTotals[category];


        const percentage =
            getCategoryPercentage(amount);


        const categoryItem =
            document.createElement("div");


        categoryItem.className =
            "category-item";


        categoryItem.innerHTML = `

            <div class="category-header">

                <span>
                    ${category}
                </span>

                <strong>
                    ₹${amount}
                </strong>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${percentage}%">
                </div>

            </div>


            <small>
                ${percentage}% of total spending
            </small>

        `;


        categoryBox.appendChild(
            categoryItem
        );

    }

}


function getCategoryPercentage(amount) {

    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },
            0
        );


    if (total === 0) {
        return 0;
    }


    return Math.round(
        (amount / total) * 100
    );

}


// FINANCIAL HEALTH SCORE

function updateFinancialHealth() {

    const healthScore =
        document.getElementById("healthScore");

    const scoreNumber =
        document.getElementById("scoreNumber");

    const healthMessage =
        document.getElementById("healthMessage");

    const healthEmoji =
        document.getElementById("healthEmoji");

    const healthProgress =
        document.getElementById("healthProgress");


    let score = 100;


    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum + expense.amount;

            },
            0
        );


    if (budget > 0) {

        const percentage =
            (total / budget) * 100;


        if (percentage > 100) {

            score -= 40;

        }

        else if (percentage >= 80) {

            score -= 25;

        }

        else if (percentage >= 60) {

            score -= 10;

        }

    }


    const wants =
        expenses.filter(
            function (expense) {
                return expense.mood === "Want";
            }
        ).length;


    if (
        expenses.length > 0 &&
        wants / expenses.length > 0.5
    ) {

        score -= 15;

    }


    const emergencies =
        expenses.filter(
            function (expense) {
                return expense.mood === "Emergency";
            }
        ).length;


    if (emergencies > 2) {

        score -= 15;

    }


    score =
        Math.max(
            0,
            Math.min(score, 100)
        );


    healthScore.textContent =
        score;


    scoreNumber.textContent =
        score;


    healthProgress.style.width =
        score + "%";


    if (score >= 80) {

        healthMessage.textContent =
            "Excellent! Your spending looks healthy.";

        healthEmoji.textContent =
            "💚";

    }

    else if (score >= 60) {

        healthMessage.textContent =
            "Good, but there is room to improve.";

        healthEmoji.textContent =
            "💛";

    }

    else if (score >= 40) {

        healthMessage.textContent =
            "Be careful with your spending.";

        healthEmoji.textContent =
            "🟠";

    }

    else {

        healthMessage.textContent =
            "Your spending needs immediate attention.";

        healthEmoji.textContent =
            "🚨";

    }

}


// SPENDING STREAK

function updateStreak() {

    const streakElement =
        document.getElementById(
            "streakCount"
        );


    if (expenses.length === 0) {

        streakElement.textContent =
            "0";

        return;

    }


    const uniqueDates =
        new Set();


    expenses.forEach(
        function (expense) {

            const date =
                new Date(expense.date);


            const dateString =
                date.toISOString()
                    .split("T")[0];


            uniqueDates.add(
                dateString
            );

        }
    );


    let streak = 0;

    const today =
        new Date();


    while (true) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() - streak
        );


        const dateString =
            date.toISOString()
                .split("T")[0];


        if (
            uniqueDates.has(dateString)
        ) {

            streak++;

        }

        else {

            break;

        }

    }


    streakElement.textContent =
        streak;

}


// CHART

function updateChart() {

    const canvas =
        document.getElementById(
            "expenseChart"
        );


    const categoryTotals = {};


    expenses.forEach(
        function (expense) {

            if (
                !categoryTotals[expense.category]
            ) {

                categoryTotals[expense.category] =
                    0;

            }


            categoryTotals[expense.category] +=
                expense.amount;

        }
    );


    const labels =
        Object.keys(categoryTotals);


    const data =
        Object.values(categoryTotals);


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart =
        new Chart(
            canvas,
            {

                type: document.getElementById("chartType").value,

                data: {

                    labels: labels.length
                        ? labels
                        : ["No Expenses"],

                    datasets: [
                        {
                            data: data.length
                                ? data
                                : [1],

                            backgroundColor: [
                                "#635bff",
                                "#8b5cf6",
                                "#06b6d4",
                                "#ec4899",
                                "#f59e0b",
                                "#16a34a",
                                "#ef4444"
                            ],

                            borderWidth: 0
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }
        );

}


// TOAST

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// DARK MODE

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "expenseDarkModeV4",
            isDark
        );

    }
);


if (
    localStorage.getItem(
        "expenseDarkModeV4"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

}


// SECURITY HELPER

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// UPDATE EVERYTHING

function updateDashboard() {

    updateSummary();

    updateBudget();

    updateSavingsGoal();

    updateMood();

    showSpendingInsights();

    showCategoryBreakdown();

    updateFinancialHealth();

    updateStreak();

    updateChart();

}

document.getElementById("chartType").addEventListener("change", updateChart);


// INITIAL LOAD

displayExpenses();

updateDashboard();


// DAILY SPENDING CHALLENGE

const dailyLimit = 500;

function updateDailyChallenge() {

    // Create the card only once
    let challengeCard = document.getElementById("dailyChallenge");

    if (!challengeCard) {

        challengeCard = document.createElement("div");
        challengeCard.id = "dailyChallenge";

        challengeCard.innerHTML = `
            <div class="challenge-header">
                <div>
                    <span class="challenge-label">DAILY CHALLENGE</span>
                    <h2>🎯 Spending Challenge</h2>
                </div>

                <div class="challenge-icon">
                    🔥
                </div>
            </div>

            <p class="challenge-text">
                Try to keep today's spending under <strong>₹${dailyLimit}</strong>
            </p>

            <div class="challenge-stats">

                <div class="challenge-stat">
                    <span>Spent Today</span>
                    <strong id="todaySpent">₹0</strong>
                </div>

                <div class="challenge-stat">
                    <span>Remaining</span>
                    <strong id="todayRemaining">₹${dailyLimit}</strong>
                </div>

            </div>

            <div class="challenge-progress">
                <div id="challengeProgress"></div>
            </div>

            <p id="challengeMessage" class="challenge-message">
                💪 You can do it!
            </p>
        `;

        document.querySelector(".app").appendChild(challengeCard);
    }


    // Get today's date
    const today = new Date();

    const todayString =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");


    // Calculate today's spending
    const todaySpent = expenses
        .filter(expense => expense.date.startsWith(todayString))
        .reduce((total, expense) => total + Number(expense.amount), 0);


    const remaining = Math.max(dailyLimit - todaySpent, 0);

    const percentage =
        Math.min((todaySpent / dailyLimit) * 100, 100);


    // Update values
    document.getElementById("todaySpent").textContent =
        `₹${todaySpent}`;

    document.getElementById("todayRemaining").textContent =
        `₹${remaining}`;


    // Update progress bar
    document.getElementById("challengeProgress").style.width =
        `${percentage}%`;


    // Update message
    const message = document.getElementById("challengeMessage");

    if (todaySpent === 0) {

        message.textContent =
            "🌟 No spending yet today. Great start!";

    } else if (todaySpent < dailyLimit * 0.5) {

        message.textContent =
            "💚 Amazing! You're doing great today.";

    } else if (todaySpent < dailyLimit) {

        message.textContent =
            "👍 You're still within today's limit.";

    } else {

        message.textContent =
            "⚠️ Daily limit exceeded. Try to spend less tomorrow.";
    }
}


// Run the feature
updateDailyChallenge();


// Keep the challenge updated when expenses change
setInterval(updateDailyChallenge, 1000);

const moneyTips = [
    "💰 Track small expenses — they add up!",
    "🎯 Set a weekly spending limit.",
    "💡 Save before you spend.",
    "🛍️ Think twice before unnecessary purchases.",
    "🌱 Small savings create big results."
];

function showMoneyTip() {
    const tip = moneyTips[Math.floor(Math.random() * moneyTips.length)];
    alert(tip);
}

