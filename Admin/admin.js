
        document.getElementById('inventoryTab').onclick = function() {
            document.getElementById('inventorySection').style.display = 'block';
            document.getElementById('customerSection').style.display = 'none';
            document.getElementById('reportsSection').style.display = 'none';
            document.getElementById('categorySection').style.display = 'none';
        };

        document.getElementById('customerTab').onclick = function() {
            document.getElementById('inventorySection').style.display = 'none';
            document.getElementById('customerSection').style.display = 'block';
            document.getElementById('reportsSection').style.display = 'none';
            document.getElementById('categorySection').style.display = 'none';
        };

        document.getElementById('reportsTab').onclick = function() {
            document.getElementById('inventorySection').style.display = 'none';
            document.getElementById('customerSection').style.display = 'none';
            document.getElementById('reportsSection').style.display = 'block';
            document.getElementById('categorySection').style.display = 'none';
        };

        document.getElementById('categoryTab').onclick = function() {
            document.getElementById('inventorySection').style.display = 'none';
            document.getElementById('customerSection').style.display = 'none';
            document.getElementById('reportsSection').style.display = 'none';
            document.getElementById('categorySection').style.display = 'block';
        };
// Add event listener to the logout button
document.querySelector('.logout-button').addEventListener('click', function() {
    // Clear any session data (optional, depending on your logic)
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to the login page
    window.location.href = '../Login/login.html';
});

        // Initialize the inventory and categories
        async function init() {
            await initializeInventory(); // Initialize inventory if necessary
            await initializeCategories(); // Initialize categories if necessary
            fetchInventory(); // Fetch existing inventory
            fetchCategories(); // Fetch existing categories
        }

        init(); // Call the init function on page load
    